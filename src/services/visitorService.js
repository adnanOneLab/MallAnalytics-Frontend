// src/services/visitorService.js
import api from './api';

// Get the base URL from the api instance
const BASE_URL = api.defaults.baseURL.replace('/api', '');

export const fetchVisitors = async () => {
  const response = await api.get('/users/');
  return response.data;
};

export const fetchVisitorProfile = async (userId) => {
  try {
    // Fetch user details including visits
    const userResponse = await api.get(`/users/${userId}/`);
    const userData = userResponse.data;

    // Fetch user interests
    const interestsResponse = await api.get(`/user-interests/${userId}/`);
    const interests = interestsResponse.data;

    // Format the data to match the frontend structure
    return {
      id: userData.user_id,
      name: userData.name,
      email: userData.email,
      phone: userData.cell_phone,
      address: userData.address,
      picture_url: userData.picture_url ? `${BASE_URL}${userData.picture_url}` : null,
      monthlyVisits: userData.monthly_visits,
      yearlyVisits: userData.yearly_visits,
      lifeVisits: userData.life_visits,
      avgTimePerVisitYear: userData.avg_time_per_visit_year,
      avgTimePerVisitLife: userData.avg_time_per_visit_life,
      storesVisitedMonth: userData.stores_visited_month,
      storesVisitedLife: userData.stores_visited_life,
      firstVisit: userData.first_visit,
      lastVisit: userData.last_visit,
      recency: userData.recency,
      monthlyFrequency: userData.monthly_freq,
      interests: interests.map(interest => interest.interest.name),
      visits: userData.visits.map(visit => ({
        visit_id:visit.visit_id,
        date: new Date(visit.visit_date).toLocaleDateString(),
        timeEntry: new Date(visit.start_time).toLocaleTimeString(),
        timeExit: visit.end_time ? new Date(visit.end_time).toLocaleTimeString() : '-',
        storesVisited: visit.stores_visited?.toString() || '0',
        timeSpent: visit.duration || '-',
        interest: interests.map(i => i.interest.name).join(', ') || '-'
      }))
    };
  } catch (error) {
    console.error('Error fetching visitor profile:', error);
    throw error;
  }
};

export const fetchMovementsByVisitId=async(visit_id)=>{
  const response=await api.get(`/movements/${visit_id}/`);
  return response.data
}