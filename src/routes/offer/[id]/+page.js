import { error } from '@sveltejs/kit';
import { getOfferById } from '$lib/api/offers';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  try {
    const response = await getOfferById(params.id);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch offer');
    }
    return { offer: response.offer };
  } catch (err) {
    console.error('Error fetching offer:', err);
    throw error(404, err.message || 'Offer not found');
  }
}
