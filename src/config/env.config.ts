interface EnvConfig {
  api: {
    baseUrl: string;
    port: string;
    affiliateUrl: string;
  }
}

export const env: EnvConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost',
    port: import.meta.env.VITE_API_PORT || '5000',
    affiliateUrl: import.meta.env.VITE_AFFILIATE_URL || 'http://localhost:5000/api/affiliate'
  }
};

// Type declarations for Vite environment variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_PORT: string;
  readonly VITE_AFFILIATE_URL: string;
  readonly MODE: 'development' | 'production' | 'test';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
