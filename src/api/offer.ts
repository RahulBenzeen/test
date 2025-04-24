// api/offers.ts
import api from "./index"; // your axios instance
import { BundleRule } from "../hooks/useBundleOffer";

// BUNDLE OFFERS

export const createBundleOffers = (offers: BundleRule[]) => 
  api.post("/api/offers/bundle/add", offers);

export const getAllBundleOffers = () => 
  api.get("/api/offers/bundle/all");

export const deleteBundleOffer = (offerId: string) => 
  api.delete(`/api/offers/bundle/${offerId}`);

// GIFT OFFERS

export const createGiftOffer = (offers: any) => 
  api.post("/api/offers/gift/add", offers);

export const getAllGiftOffers = () => 
  api.get("/api/offers/gift/all");

export const deleteGiftOffer = (offerId: string) => 
  api.delete(`/api/offers/gift/${offerId}`);
