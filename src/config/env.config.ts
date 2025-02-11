// src/config/env.config.ts

interface EnvConfig {
    api: {
      baseUrl: string;
      port: string;
    }
  }
  
  export const env: EnvConfig = {
    api: {
      baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost',
      port: import.meta.env.VITE_API_PORT || '5000',
    }
  };
  
  // Type declarations for Vite environment variables
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_PORT: string;
    readonly MODE: 'development' | 'production' | 'test';
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }