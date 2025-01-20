import axios from "axios";

// Create an axios instance
const Api = axios.create({
  baseURL:
    process.env["REACT_APP_BACKEND_BASE_URL"] || "http://localhost:8484/api",
  withCredentials: true,
});

// Function to get headers, including authorization if available
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
  };
};

// Add a response interceptor to handle errors globally
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors (e.g., show toast notifications, redirect on 401, etc.)
    return Promise.reject(error);
  }
);

// ** ==================== Authentication API ======================== ** //
export const loginUserApi = (data) => Api.post("/auth/login", data);
export const registerUserApi = (data) => Api.post("/auth/register", data);
export const oauthApi = (data) => Api.post("/auth/oauth", data);

// ** ==================== Artists API ======================== ** //
export const getTopArtistsApi = () => Api.get("/artist", getHeaders());
export const getArtistsApi = () => Api.get("/artist", getHeaders());
export const getArtistApi = (id) => Api.get(`/artist/${id}`, getHeaders());
export const increaseArtistStreamCountApi = (id, keyword) =>
  Api.patch(
    `/artist/stream-count/${id}?keyword=${keyword}`,
    undefined,
    getHeaders()
  );

// ** ==================== Songs API ======================== ** //
export const getTrendingSongsApi = (page) =>
  Api.get(`/song/trending/get-all?page=${page}`, getHeaders());
export const getSongsApi = (page) =>
  Api.get(`/song?page=${page}`, getHeaders());
export const getSearchSongsApi = (page, keyword) =>
  Api.get(`/song?page=${page}&keyword=${keyword}`, getHeaders());
export const getPopularSongsApi = () => Api.get("/song/popular", getHeaders()); // Added endpoint for popular songs
export const getSongApi = (id) => Api.get(`/song/${id}`, getHeaders());
export const getSongsByArtistIdApi = (id, keyword) =>
  Api.get(`/song/get-all/songs/artist/${id}?keyword=${keyword}`, getHeaders());
export const increaseSongPlayCountApi = (id) =>
  Api.patch(`/song/play-count/${id}`, undefined, getHeaders());

// ** ==================== Playlists API ======================== ** //
export const getPlaylistsApi = (page) =>
  Api.get(`/user/playlist?page=${page}`, getHeaders());
export const getPlaylistApi = (id) =>
  Api.get(`/user/playlist/${id}`, getHeaders());
export const createPlaylistApi = (data) =>
  Api.post(`/user/playlist`, data, getHeaders());
export const deletePlaylistApi = (id) =>
  Api.delete(`/user/playlist/${id}`, getHeaders());
export const editPlaylistApi = (id, data) =>
  Api.patch(`/user/playlist/${id}`, data, getHeaders());
export const addSongToPlaylistApi = (playlistId, songId) =>
  Api.patch(
    `/user/playlist/${playlistId}/song/${songId}`,
    undefined,
    getHeaders()
  );

// ** ==================== Favorites API ======================== ** //
export const getFavoritesApi = (page) =>
  Api.get(`/user/favorite?page=${page}`, getHeaders());
export const addSongToFavoriteApi = (data) =>
  Api.post(`/user/favorite`, data, getHeaders());
export const removeSongFromFavoriteApi = (id) =>
  Api.delete(`/user/favorite/${id}`, getHeaders());
export const isFavoriteSongApi = (id) =>
  Api.get(`/user/favorite/${id}`, getHeaders());

// ** ==================== Users API ======================== ** //
export const changePasswordApi = (data) =>
  Api.patch(`/user/change-password`, data, getHeaders());
export const meApi = () => Api.get(`/user/me`, getHeaders());
export const updateUserApi = (data) =>
  Api.patch(`/user/me`, data, getHeaders());

// ** ==================== Users API ======================== ** //
export const storeUserGenreApi = (data) =>
  Api.post(`/user-genre`, data, getHeaders());
export const getGenresApi = () => Api.get(`/genre`, getHeaders());

// ** ==================== Admins API ======================== ** //
export const getCustomersApi = () => Api.get(`/user`, getHeaders());

// Songs
export const addSongApi = (data) => Api.post(`/song`, data, getHeaders());
export const updateSongApi = (id, data) =>
  Api.patch(`/song/${id}`, data, getHeaders());
export const deleteSongApi = (id) => Api.delete(`/song/${id}`, getHeaders());

// Artists
export const addArtistApi = (data) => Api.post(`/artist`, data, getHeaders());
export const updateArtistApi = (id, data) =>
  Api.patch(`/artist/${id}`, data, getHeaders());
export const deleteArtistApi = (id) =>
  Api.delete(`/artist/${id}`, getHeaders());

// Genres
export const addGenreApi = (data) => Api.post(`/genre`, data, getHeaders());
export const updateGenreApi = (id, data) =>
  Api.patch(`/genre/${id}`, data, getHeaders());
export const deleteGenreApi = (id) => Api.delete(`/genre/${id}`, getHeaders());
