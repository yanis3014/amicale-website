export { api, getToken, setToken, getBaseUrl, ApiError } from './client';
export { login, register, getMe, changePassword, logout } from './auth';
export {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  getRegistrations,
  registerToEvent,
  confirmRegistration,
  cancelRegistration,
} from './events';
export { getActivities, getActivity } from './activities';
export { getEnseignants, getEnseignant } from './enseignants';
export { getMyProfile, getMyEvents } from './members';
export { submitCotisation } from './cotisations';
export { getImageUrl } from './utils/imageUrl';
export * from './types';
