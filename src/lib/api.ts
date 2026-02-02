import axios from "axios";

const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

// API functions for tutors
export const tutorApi = {
  search: (params?: Record<string, any>) =>
    api.get("/tutors", { params }).then((res) => res.data),
  getById: (id: string) => api.get(`/tutors/${id}`).then((res) => res.data),
  createProfile: (data: any) =>
    api.post("/tutors/profile", data).then((res) => res.data),
  updateProfile: (data: any) =>
    api.put("/tutors/me/profile", data).then((res) => res.data),
  getMyProfile: () => api.get("/tutors/me/profile").then((res) => res.data),
  getMyAvailability: () =>
    api.get("/tutors/me/availability").then((res) => res.data),
  addAvailability: (data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }) => api.post("/tutors/me/availability", data).then((res) => res.data),
  updateAvailability: (
    id: string,
    data: { dayOfWeek?: number; startTime?: string; endTime?: string },
  ) => api.put(`/tutors/me/availability/${id}`, data).then((res) => res.data),
  deleteAvailability: (id: string) =>
    api.delete(`/tutors/me/availability/${id}`).then((res) => res.data),
};

// API functions for categories
export const categoryApi = {
  getAll: () => api.get("/categories").then((res) => res.data),
  getById: (id: string) => api.get(`/categories/${id}`).then((res) => res.data),
  create: (data: any) => api.post("/categories", data).then((res) => res.data),
  update: (id: string, data: any) =>
    api.put(`/categories/${id}`, data).then((res) => res.data),
  delete: (id: string) =>
    api.delete(`/categories/${id}`).then((res) => res.data),
};

// API functions for bookings
export const bookingApi = {
  create: (data: any) => api.post("/bookings", data).then((res) => res.data),
  getMyBookings: (params?: Record<string, any>) =>
    api.get("/bookings/my", { params }).then((res) => res.data),
  getById: (id: string) => api.get(`/bookings/${id}`).then((res) => res.data),
  cancel: (id: string) =>
    api.patch(`/bookings/${id}/cancel`).then((res) => res.data),
  confirm: (id: string) =>
    api.patch(`/bookings/${id}/confirm`).then((res) => res.data),
  complete: (id: string) =>
    api.patch(`/bookings/${id}/complete`).then((res) => res.data),
};

// API functions for reviews
export const reviewApi = {
  create: (data: any) => api.post("/reviews", data).then((res) => res.data),
  getTutorReviews: (tutorProfileId: string, params?: Record<string, any>) =>
    api
      .get(`/reviews/tutor/${tutorProfileId}`, { params })
      .then((res) => res.data),
  getMyReviews: (params?: Record<string, any>) =>
    api.get("/reviews/me", { params }).then((res) => res.data),
  update: (id: string, data: any) =>
    api.put(`/reviews/${id}`, data).then((res) => res.data),
};

// API functions for users
export const userApi = {
  getProfile: () => api.get("/users/me").then((res) => res.data),
  updateProfile: (data: any) =>
    api.put("/users/me", data).then((res) => res.data),
  getDashboard: () => api.get("/users/dashboard").then((res) => res.data),
};

// API functions for admin
export const adminApi = {
  getDashboardStats: () => api.get("/admin/dashboard").then((res) => res.data),
  getUsers: (params?: Record<string, any>) =>
    api.get("/admin/users", { params }).then((res) => res.data),
  getUserById: (id: string) =>
    api.get(`/admin/users/${id}`).then((res) => res.data),
  updateUserRole: (id: string, role: string) =>
    api.patch(`/admin/users/${id}/role`, { role }).then((res) => res.data),
  getAllBookings: (params?: Record<string, any>) =>
    api.get("/admin/bookings", { params }).then((res) => res.data),
};
