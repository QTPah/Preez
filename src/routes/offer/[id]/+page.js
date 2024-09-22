import { recommendedOffers } from '../../../data/offers';

export function load({ params }) {
  const offer = recommendedOffers.find(o => o.id === parseInt(params.id));
  
  if (!offer) {
    return {
      status: 404,
      error: new Error(`Offer with ID ${params.id} not found`)
    };
  }

  return { offer };
}
