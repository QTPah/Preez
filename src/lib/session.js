import { setSession } from '../stores/auth';

export async function handleSession({ event, resolve }) {
  const session = event.cookies.get('session');
  
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      setSession(sessionData);
    } catch (error) {
      console.error('Error parsing session:', error);
    }
  }

  const response = await resolve(event);

  return response;
}
