import { BundleRule } from "../hooks/useBundleOffer";
import api from "./index"; // axios instance



// Create multiple bundle offers
export const createBundleOffers = (offers: BundleRule[]) => 
  api.post("/api/offers/bundle/add", offers);

// Get all bundle offers
export const getAllBundleOffers = () => 
  api.get("/api/bundle-offers");

// Delete a specific bundle offer by ID
export const deleteBundleOffer = (offerId: string) => 
  api.delete(`/api/bundle-offers/${offerId}`);


export const createGiftOffer = (offers: any) => 
  api.post("/api/offers/gift/add", offers);