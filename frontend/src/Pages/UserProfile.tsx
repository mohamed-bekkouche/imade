import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import authService from "../services/authService";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePicture: "",
    gender: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "", // Never pre-fill password
      profilePicture: user.profilePicture || "",
      gender: user.gender || "",
    });
  }, [user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingAvatar(true);
      setError("");

      const data = await authService.updateAvatar(formData);
      setSuccess("Profile picture updated successfully");
      login(data.user);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError(
        error.response?.data?.message || "Error uploading profile picture"
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Separate handler for profile info update
  const updateProfileInfo = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Only send fields that have changed
      const payload = {
        ...(formData.firstName !== user?.firstName && {
          firstName: formData.firstName,
        }),
        ...(formData.lastName !== user?.lastName && {
          lastName: formData.lastName,
        }),
        ...(formData.email !== user?.email && { email: formData.email }),
        ...(formData.password && { password: formData.password }),
        ...(formData.gender !== user?.gender && { gender: formData.gender }),
      };

      const data = await authService.updateUser(payload);
      setSuccess("Profile updated successfully");
      login(data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Modified handleSubmit to only handle profile info
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileInfo();
  };

  // Modified handleFileChange to use the separate uploadAvatar function
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAvatar(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                {success}
              </div>
            )}

            <div className="flex flex-col items-center mb-6">
              <div
                className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border border-gray-200 mb-4 overflow-hidden relative group cursor-pointer"
                onClick={handleAvatarClick}
              >
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
                {user?.avatar ? (
                  <img
                    src={"http://localhost:8000" + user?.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-blue-600 text-4xl" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaCamera className="text-white text-xl" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <h2 className="text-xl font-semibold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Password (leave blank to keep current)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-500 text-sm">
                    Personal Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        First Name
                      </p>
                      <p className="mt-1">{user?.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Last Name
                      </p>
                      <p className="mt-1">{user?.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Gender
                      </p>
                      <p className="mt-1">{user?.gender || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
