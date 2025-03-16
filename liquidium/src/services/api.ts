import { Collection, CreateOfferData, Offer, PaginatedResponse, WalletResponse } from '@/types';
import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: 'http://localhost:3002/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Wallet API
export const getWalletData = async (): Promise<WalletResponse> => {
  const response = await api.get<WalletResponse>('/wallet');
  return response.data;
};

// Collections API
export const getSupportedCollections = async (): Promise<Collection[]> => {
  const response = await api.get<Collection[]>('/collections');
  return response.data;
};

// Offers API
export const getOffers = async (userId: string, page: number = 1, limit: number = 4): Promise<PaginatedResponse> => {
  const response = await api.get<PaginatedResponse>(`/offers?userId=${userId}&page=${page}&limit=${limit}`);
  return response.data;
};

export const createOffer = async (offerData: CreateOfferData): Promise<Offer> => {
  const response = await api.post<Offer>('/offers', offerData);
  return response.data;
};

export const updateOffer = async (id: string, offerData: Partial<CreateOfferData>): Promise<Offer> => {
  const response = await api.patch<Offer>(`/offers/${id}`, offerData);
  return response.data;
};

export const deleteOffer = async (id: string): Promise<boolean> => {
  await api.delete(`/offers/${id}`);
  return true;
};

export const getOffer = async (id: string): Promise<Offer> => {
  const response = await api.get<Offer>(`/offers/${id}`);
  return response.data;
};