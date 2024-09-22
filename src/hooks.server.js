import { sequence } from '@sveltejs/kit/hooks';
import { handleSession } from '$lib/session';

export const handle = sequence(handleSession);
