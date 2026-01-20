import { z } from 'zod'

import { aceFetch } from '@/lib/api'
import type {
  PasskeyAssertionJSON,
  PasskeyAttestationJSON,
  PasskeyCreationOptionsJSON,
  PasskeyRequestOptionsJSON,
} from '@/src/lib/webauthn'

const transportSchema = z.enum(['usb', 'nfc', 'ble', 'internal', 'hybrid'])

const credentialDescriptorSchema = z.object({
  id: z.string(),
  type: z.literal('public-key'),
  transports: z.array(transportSchema).optional(),
})

const passkeyRequestOptionsSchema: z.ZodType<PasskeyRequestOptionsJSON> = z.object({
  challenge: z.string(),
  timeout: z.number().optional(),
  rpId: z.string().optional(),
  allowCredentials: z.array(credentialDescriptorSchema).optional(),
  userVerification: z.enum(['required', 'preferred', 'discouraged']).optional(),
})

const passkeyCreationOptionsSchema: z.ZodType<PasskeyCreationOptionsJSON> = z.object({
  challenge: z.string(),
  rp: z.object({
    id: z.string().optional(),
    name: z.string(),
  }),
  user: z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
  }),
  pubKeyCredParams: z.array(
    z.object({
      type: z.literal('public-key'),
      alg: z.number(),
    })
  ),
  timeout: z.number().optional(),
  attestation: z.enum(['none', 'indirect', 'direct', 'enterprise']).optional(),
  excludeCredentials: z.array(credentialDescriptorSchema).optional(),
  authenticatorSelection: z
    .object({
      authenticatorAttachment: z.enum(['platform', 'cross-platform']).optional(),
      residentKey: z.enum(['discouraged', 'preferred', 'required']).optional(),
      requireResidentKey: z.boolean().optional(),
      userVerification: z.enum(['required', 'preferred', 'discouraged']).optional(),
    })
    .optional(),
})

const passkeyAssertionSchema: z.ZodType<PasskeyAssertionJSON> = z.object({
  id: z.string(),
  rawId: z.string(),
  type: z.literal('public-key'),
  response: z.object({
    authenticatorData: z.string(),
    clientDataJSON: z.string(),
    signature: z.string(),
    userHandle: z.string().optional(),
  }),
})

const passkeyAttestationSchema: z.ZodType<PasskeyAttestationJSON> = z.object({
  id: z.string(),
  rawId: z.string(),
  type: z.literal('public-key'),
  response: z.object({
    attestationObject: z.string(),
    clientDataJSON: z.string(),
    transports: z.array(transportSchema).optional(),
  }),
})

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
})

export type User = z.infer<typeof userSchema>

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const loginResponseSchema = z.object({
  requiresTwoFactor: z.boolean(),
  message: z.string().optional(),
})

const meResponseSchema = z.object({
  user: userSchema,
})

const passkeyAuthStartSchema = z.object({
  publicKey: passkeyRequestOptionsSchema,
})

const passkeyAuthFinishSchema = z.object({
  user: userSchema,
})

const passkeyRegisterStartSchema = z.object({
  publicKey: passkeyCreationOptionsSchema,
})

const passkeyRegisterFinishSchema = z.union([z.object({ user: userSchema }), z.object({})])

const refreshSchema = z.union([z.object({ user: userSchema }), z.object({})])
const logoutSchema = z.any()

const parseSchema = <T>(schema: z.ZodSchema<T>, payload: unknown, label: string): T => {
  const parsed = schema.safeParse(payload)

  if (!parsed.success) {
    console.error(`[authApi] Invalid ${label}`, parsed.error)
    throw new Error('Invalid response format')
  }

  return parsed.data
}

const parseRequest = <T>(schema: z.ZodSchema<T>, payload: unknown, label: string): T => {
  const parsed = schema.safeParse(payload)

  if (!parsed.success) {
    console.error(`[authApi] Invalid ${label}`, parsed.error)
    throw new Error('Invalid request format')
  }

  return parsed.data
}

export type LoginPayload = z.infer<typeof loginRequestSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const request = parseRequest(loginRequestSchema, payload, 'login payload')
  const data = await aceFetch<unknown>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
    credentials: 'include',
  })

  return parseSchema(loginResponseSchema, data, 'login response')
}

export async function getCurrentUser(): Promise<z.infer<typeof meResponseSchema>> {
  const data = await aceFetch<unknown>('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
  })

  return parseSchema(meResponseSchema, data, 'session response')
}

export async function startPasskeyAuthentication(): Promise<z.infer<typeof passkeyAuthStartSchema>> {
  const data = await aceFetch<unknown>('/api/auth/webauthn/authenticate/start', {
    method: 'POST',
    body: JSON.stringify({}),
    credentials: 'include',
  })

  return parseSchema(passkeyAuthStartSchema, data, 'passkey auth start')
}

export async function finishPasskeyAuthentication(
  payload: PasskeyAssertionJSON
): Promise<z.infer<typeof passkeyAuthFinishSchema>> {
  const request = parseRequest(passkeyAssertionSchema, payload, 'passkey auth payload')
  const data = await aceFetch<unknown>('/api/auth/webauthn/authenticate/finish', {
    method: 'POST',
    body: JSON.stringify(request),
    credentials: 'include',
  })

  return parseSchema(passkeyAuthFinishSchema, data, 'passkey auth finish')
}

export async function startPasskeyRegistration(): Promise<z.infer<typeof passkeyRegisterStartSchema>> {
  const data = await aceFetch<unknown>('/api/auth/webauthn/register/start', {
    method: 'POST',
    body: JSON.stringify({}),
    credentials: 'include',
  })

  return parseSchema(passkeyRegisterStartSchema, data, 'passkey register start')
}

export async function finishPasskeyRegistration(
  payload: PasskeyAttestationJSON
): Promise<z.infer<typeof passkeyRegisterFinishSchema>> {
  const request = parseRequest(passkeyAttestationSchema, payload, 'passkey register payload')
  const data = await aceFetch<unknown>('/api/auth/webauthn/register/finish', {
    method: 'POST',
    body: JSON.stringify(request),
    credentials: 'include',
  })

  return parseSchema(passkeyRegisterFinishSchema, data, 'passkey register finish')
}

export async function refreshSession(): Promise<z.infer<typeof refreshSchema>> {
  const data = await aceFetch<unknown>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({}),
    credentials: 'include',
  })

  return parseSchema(refreshSchema, data, 'refresh response')
}

export async function logout(): Promise<void> {
  const data = await aceFetch<unknown>('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({}),
    credentials: 'include',
  })

  parseSchema(logoutSchema, data, 'logout response')
}
