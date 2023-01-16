const BaseUrls = {
  TEST: 'https://xxx.com',
  PRE: 'https://xxx.com',
  PROD: 'https://xxx.com',
}

const buildEnv: 'TEST' | 'PRE' | 'PROD' = import.meta.env.VITE_BUILD

export const baseUrl = BaseUrls[buildEnv]