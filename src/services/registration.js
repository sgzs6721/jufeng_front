import api from '../config/api';

export const registrationService = {
  register: (data) => api.post('/registrations', data),
  
  getRemainingSlots: () => api.get('/registrations/remaining-slots'),
  
  getAllRegistrations: () => api.get('/registrations'),
};

export default registrationService;

