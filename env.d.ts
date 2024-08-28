declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_URL: string;
    NODE_ENV: string;
    PORT: number;
    TMDB_API_KEY: string;
    TMDB_API_ACCESS_KEY: string;
    GOOGLE_SERVICE_CREDENTIALS: string;
    GUEST_NAME: string;
    GUEST_PASSWORD: string;
  }
}
