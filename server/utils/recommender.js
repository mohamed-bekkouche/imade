import axios from "axios";

async function getRecommendedItems(likedItems) {
  try {
    const response = await axios.post("http://127.0.0.1:5001/predict", {
      liked_items: likedItems,
    });
    return response.data.recommended_items;
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    return [];
  }
}

export default getRecommendedItems;
