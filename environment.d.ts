declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGO_CONNECT: string;
      }
    }
}

export {}