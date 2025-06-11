import { api } from "../api/api";

export const getFullImageUrl = (imagePath: string) => {
  if (!imagePath) return 'https://placehold.co/400x300/e2e8f0/1e40af?text=No+Image';
  
  // If it's already a full URL, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove 'public/' prefix if it exists and normalize slashes
  const normalizedPath = imagePath
    .replace(/^public[\/\\]/, '')  // Remove public/ or public\ prefix
    .replace(/\\/g, '/');          // Convert backslashes to forward slashes
  
  // Construct the full URL - the path should already contain 'uploads/'
  return `${api.defaults.baseURL}/${normalizedPath}`;
};