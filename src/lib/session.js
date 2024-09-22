import { auth } from '../stores/auth';

export const handleSession = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      auth.setSession(sessionData);
    } catch (error) {
      console.error('Error parsing session cookie:', error);
    }
  }

  const response = await resolve(event);

  return response;
};
