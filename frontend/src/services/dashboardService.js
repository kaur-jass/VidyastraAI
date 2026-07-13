import api from './api';

export const dashboardService = {
  // Fetch stats for any dashboard type
  getDashboardStats: (role) => api.get(`/dashboard/stats/${role}`),

  // Student specific calls
  getStudentCourses: () => api.get('/student/my-courses'),
  
  // Faculty specific calls
  getLiveClass: () => api.get('/faculty/live-classes'),
  
  // Admin specific calls
  getAdminOverview: () => api.get('/admin/overview'),
};