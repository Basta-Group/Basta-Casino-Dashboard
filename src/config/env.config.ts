/**
 * Environment Configuration Module
 * 
 * This module handles environment variables and configuration settings for the application.
 * It provides type-safe access to environment variables with fallback values and
 * centralizes the configuration for API endpoints and dashboard URLs.
 * 
 * @module env.config
 */

/**
 * Interface defining the structure of the application's environment configuration
 */
interface EnvConfig {
  api: {
    baseUrl: string;      // Base URL for the API
    port: string;         // Port number for the API
    affiliateUrl: string; // URL for affiliate-related API endpoints
  };
  dashboard: {
    url: string;          // URL for the dashboard application
  };
}

/**
 * Environment configuration object with fallback values
 * Uses Vite's environment variables with fallback to default values
 */
export const env: EnvConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost',
    port: import.meta.env.VITE_API_PORT || '5000',
    affiliateUrl: import.meta.env.VITE_AFFILIATE_URL || 'http://localhost:5000/api/affiliate'
  },
  dashboard: {
    url: import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3001'
  }
};

/**
 * Type declarations for Vite environment variables
 * These interfaces ensure type safety when accessing environment variables
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;    // Base URL for the API
  readonly VITE_API_PORT: string;        // Port number for the API
  readonly VITE_AFFILIATE_URL: string;   // URL for affiliate-related API endpoints
  readonly VITE_DASHBOARD_URL: string;   // URL for the dashboard application
  readonly MODE: 'development' | 'production' | 'test';  // Current environment mode
}

/**
 * Interface for Vite's import.meta object
 * Extends the base ImportMeta interface with environment variables
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
