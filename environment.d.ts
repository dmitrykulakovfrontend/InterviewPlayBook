declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      GITHUB_ID: string;
      GITHUB_SECRET: string;
      GOOGLE_ID: string;
      GOOGLE_SECRET: string;
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_KEY: string;
      CLOUDINARY_SECRET: string;
      CLOUDINARY_URL: string;
      REVALIDATION_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
