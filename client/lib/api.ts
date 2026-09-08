/**
 * SkillQuest API Client
 * This module handles all communication with the Flask backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = {
  async get(endpoint: string, token?: string) {
    // TODO: Implement fetch call with Authorization header
    console.log(`Fetching from ${API_BASE_URL}${endpoint}`);
    return { data: {} };
  },

  async post(endpoint: string, body: any, token?: string) {
    // TODO: Implement fetch POST call
    console.log(`Posting to ${API_BASE_URL}${endpoint}`);
    return { data: {} };
  },
};
