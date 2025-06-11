

import pandas as pd
import numpy as np
import joblib
from flask import Flask, request, jsonify


app = Flask(__name__)

# --- Load the KNN recommendation model components ---
KNN_MODEL_PATH = './modele_Knn.joblib'

try:
    with open(KNN_MODEL_PATH, 'rb') as f:
        modele_complet = joblib.load(f)
    knn_model = modele_complet['knn']
    encoder = modele_complet['encoder']
    scaler = modele_complet['scaler']
    categorical_cols = modele_complet['categorical_cols']
    numerical_cols = modele_complet['numerical_cols']
    df_cleaned_for_reco = modele_complet['df_cleaned']
    print(f"✅ KNN Model components loaded successfully from {KNN_MODEL_PATH}")
    print(f"Categorical features: {categorical_cols}")
    print(f"Numerical features: {numerical_cols}")
    print(f"Shape of df_cleaned_for_reco: {df_cleaned_for_reco.shape}")
    knn_model_loaded = True
except FileNotFoundError:
    print(f"Warning: {KNN_MODEL_PATH} not found. Recommendation endpoint will be disabled.")
    knn_model_loaded = False
except Exception as e:
    print(f"Warning: Error loading KNN model: {e}. Recommendation endpoint will be disabled.")
    knn_model_loaded = False

# --- Load the prediction model ---
PREDICTION_MODEL_PATH = './model.pkl'

try:
    prediction_model = joblib.load(PREDICTION_MODEL_PATH)
    print(f"✅ Prediction model loaded successfully from {PREDICTION_MODEL_PATH}")
    prediction_model_loaded = True
except FileNotFoundError:
    print(f"Warning: {PREDICTION_MODEL_PATH} not found. Prediction endpoint will be disabled.")
    prediction_model_loaded = False
except Exception as e:
    print(f"Warning: Error loading prediction model: {e}. Prediction endpoint will be disabled.")
    prediction_model_loaded = False

# Define the expected input features for prediction model
expected_features = [
    'domain',
    'course_name',
    'level',
    'format',
    'Duration',
    'age_range',
    'education_level',
    'programming_level',
    'learning_style',
    'available_time_per_week',
    'course_duration_pref',
    'preferred_theme'
]

# --- Preprocessing functions for KNN recommendation ---
def preprocess_new_student_data(student_data_df):
    """
    Preprocesses a DataFrame of new student data for KNN recommendation.
    Assumes student_data_df has the same column names as original df_cleaned.
    """
    # Ensure all required columns are present.
    # Add 'id_app' with a large unique value if not provided.
    if 'id_app' not in student_data_df.columns or pd.isna(student_data_df['id_app'].iloc[0]):
        student_data_df['id_app'] = 99999 # Assign a large placeholder ID
    else:
        student_data_df['id_app'] = pd.to_numeric(student_data_df['id_app'], errors='coerce')

    # Handle 'available_time_per_week' conversion
    def convertir_temps(texte):
        if isinstance(texte, str):
            texte = texte.strip().lower()
            if "moins de 2" in texte:
                return 1.0
            # More robust check for '2 à 5' or '2 a 5'
            elif ("2 à 5" in texte) or ("2 a 5" in texte):
                return 3.5
            # More robust check for '5 à 10' or '5 a 10'
            elif ("5 à 10" in texte) or ("5 a 10" in texte):
                return 7.5
            elif "plus de 10" in texte:
                return 12.5
        return np.nan # Return NaN if not convertible
    student_data_df['available_time_per_week'] = student_data_df['available_time_per_week'].apply(convertir_temps)

    # Handle 'course_duration_pref' conversion
    def convertir_duree(texte):
        if isinstance(texte, str):
            texte = texte.strip().lower()
            if "courte" in texte:
                return 1.0
            elif "moyenne" in texte:
                return 2.0
            elif "longue" in texte:
                return 3.0
        return np.nan # Return NaN if not convertible
    student_data_df['course_duration_pref'] = student_data_df['course_duration_pref'].apply(convertir_duree)

    # Convert 'Note' to numeric type, coercing errors to NaN
    if 'Note' not in student_data_df.columns:
        student_data_df['Note'] = np.nan # Ensure 'Note' column exists
    else:
        student_data_df['Note'] = pd.to_numeric(student_data_df['Note'], errors='coerce')

    # Ensure all numerical columns are numeric, coercing errors
    for col in numerical_cols:
        if col != 'id_app': # id_app is handled above
            student_data_df[col] = pd.to_numeric(student_data_df[col], errors='coerce')

    # Handle potential NaNs introduced by conversions before encoding/scaling
    # A simple strategy for new data: fill with mode/median if missing critical info
    # For categorical columns, fill with the mode from the training data
    for col in categorical_cols:
        if col not in student_data_df.columns:
            # Add column if missing and fill with mode
            mode_value = df_cleaned_for_reco[col].mode()[0]
            student_data_df[col] = mode_value
        # Check if the column is entirely NaN for the new input row (unlikely for a single row if present)
        if student_data_df[col].isnull().all():
            mode_value = df_cleaned_for_reco[col].mode()[0]
            student_data_df[col] = mode_value

    # For numerical columns, fill with the median from the training data
    for col in numerical_cols:
        # Exclude 'id_app' as it's handled above
        if col != 'id_app' and student_data_df[col].isnull().all():
            median_value = df_cleaned_for_reco[col].median()
            student_data_df[col] = median_value
        elif col == 'Note' and student_data_df[col].isnull().all():
            # If 'Note' is missing, assign a neutral default like the average or median score
            student_data_df[col] = df_cleaned_for_reco['Note'].median()

    # Encode categorical features
    X_cat_encoded_new = encoder.transform(student_data_df[categorical_cols])

    # Scale numerical features
    X_num_scaled_new = scaler.transform(student_data_df[numerical_cols])

    # Combine all features
    X_features_new = np.hstack([X_cat_encoded_new, X_num_scaled_new])

    return X_features_new

# --- Recommendation Logic ---
def recommander_cours_high_perf_neighbors(student_features, student_domaine, k=10, min_score=60):
    """
    Recommends a course for a new student based on high-performing neighbors
    in the same domain.
    """
    distances, voisins_indices = knn_model.kneighbors(student_features)
    voisins_indices = voisins_indices[0]

    voisins_data = df_cleaned_for_reco.iloc[voisins_indices]

    # Filter for high-performing neighbors in the same domain
    voisins_bons = voisins_data[
        (voisins_data['Note'] >= min_score) &
        (voisins_data['domaine'].str.strip() == student_domaine.strip())
    ]

    if voisins_bons.empty:
        return None

    # Recommend the course with the highest average score among these good neighbors
    scores_par_formation = voisins_bons.groupby('formation_suivie')['Note'].mean()
    formation_recommandee = scores_par_formation.idxmax()
    score = scores_par_formation.max()
    return formation_recommandee, score

# --- Flask API Endpoints ---

@app.route('/recommend', methods=['POST'])
def recommend():
    """KNN-based course recommendation endpoint"""
    if not knn_model_loaded:
        return jsonify({"error": "KNN recommendation model not loaded"}), 503
    
    try:
        student_data = request.get_json(force=True)
        if not student_data:
            return jsonify({"error": "No JSON data received."}), 400

        input_df = pd.DataFrame([student_data])

        # Get the 'domaine' of the new student before preprocessing numericals
        # Ensure it's treated as string to avoid errors
        student_domaine = str(input_df.get('domaine', '')).strip()

        # Preprocess the new student data
        student_features_processed = preprocess_new_student_data(input_df)

        # Make the recommendation
        recommendation_result = recommander_cours_high_perf_neighbors(
            student_features_processed,
            student_domaine,
            k=10,
            min_score=60
        )

        if recommendation_result: # Check if it's not None
            recommended_course, avg_score = recommendation_result # Then unpack
            return jsonify({
                "recommendation": recommended_course,
                "average_score_of_similar_high_performers": round(avg_score, 2)
            })
        else:
            top_course_global = df_cleaned_for_reco.groupby('formation_suivie')['Note'].mean().idxmax()
            return jsonify({
                "recommendation": "No specific personalized recommendation found. Try this popular course instead:",
                "fallback_course": top_course_global,
                "average_score_of_fallback": round(df_cleaned_for_reco.groupby('formation_suivie')['Note'].mean().max(), 2)
            })

    except Exception as e:
        app.logger.error(f"Error during recommendation: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """Model prediction endpoint"""
    if not prediction_model_loaded:
        return jsonify({"error": "Prediction model not loaded"}), 503
    
    # Get JSON data from request
    data = request.get_json()

    # Validate input data
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    # Check for missing features
    missing_features = [feat for feat in expected_features if feat not in data]
    if missing_features:
        return jsonify({
            'error': 'Missing required features',
            'missing': missing_features
        }), 400

    # Convert input data to DataFrame
    input_df = pd.DataFrame([data])

    try:
        # Make prediction
        prediction = prediction_model.predict(input_df)

        return jsonify({
            'prediction': float(prediction[0]),
            'status': 'success'
        })

    except Exception as e:
        return jsonify({
            'error': f'Model prediction failed: {str(e)}',
            'received_data': input_df.to_dict(orient='records'),
            'status': 'error'
        }), 500

# --- Health Check Endpoint ---
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    status = {
        "status": "healthy",
        "message": "API is running",
        "services": {
            "knn_recommendation": "available" if knn_model_loaded else "unavailable",
            "prediction": "available" if prediction_model_loaded else "unavailable"
        }
    }
    return jsonify(status)

@app.route('/', methods=['GET'])
def home():
    """API information endpoint"""
    return jsonify({
        "message": "Combined ML API - Course Recommendation and Prediction",
        "endpoints": {
            "/health": "GET - Health check",
            "/recommend": "POST - KNN-based course recommendation",
            "/predict": "POST - Model prediction"
        },
        "status": {
            "knn_recommendation": "available" if knn_model_loaded else "unavailable",
            "prediction": "available" if prediction_model_loaded else "unavailable"
        }
    })

if __name__ == '__main__':
    # For development
    app.run(debug=True, host='0.0.0.0', port=5001)
    
    # For production, uncomment the line below and comment the line above
    # serve(app, host='0.0.0.0', port=5001)


