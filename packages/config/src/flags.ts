import { env } from './env'

export const flags = {
  // Habilitado solo en dev para mostrar información de debug
  DEBUG_MODE: env.NODE_ENV === "development",
  // Blockchain: en dev usar mock, en staging/prod usar Polygon Amoy
  BLOCKCHAIN_ENABLED: env.NODE_ENV !== "development",
  // Email: en dev logear en consola, en staging/prod usar Resend
  EMAIL_PROVIDER: env.NODE_ENV === "development" ? "console" : "resend",
} as const

export type FeatureFlag = keyof typeof flags
export const getFlag = <K extends FeatureFlag>(key: K): typeof flags[K] => flags[key]
