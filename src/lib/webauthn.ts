'use client'

export type PasskeyCredentialDescriptorJSON = {
  id: string
  type: 'public-key'
  transports?: AuthenticatorTransport[]
}

export type PasskeyRequestOptionsJSON = {
  challenge: string
  timeout?: number
  rpId?: string
  allowCredentials?: PasskeyCredentialDescriptorJSON[]
  userVerification?: UserVerificationRequirement
}

export type PasskeyCreationOptionsJSON = {
  challenge: string
  rp: {
    id?: string
    name: string
  }
  user: {
    id: string
    name: string
    displayName: string
  }
  pubKeyCredParams: Array<{
    type: 'public-key'
    alg: number
  }>
  timeout?: number
  attestation?: AttestationConveyancePreference
  excludeCredentials?: PasskeyCredentialDescriptorJSON[]
  authenticatorSelection?: AuthenticatorSelectionCriteria
}

export type PasskeyAssertionJSON = {
  id: string
  rawId: string
  response: {
    authenticatorData: string
    clientDataJSON: string
    signature: string
    userHandle?: string
  }
  type: 'public-key'
}

export type PasskeyAttestationJSON = {
  id: string
  rawId: string
  response: {
    attestationObject: string
    clientDataJSON: string
    transports?: AuthenticatorTransport[]
  }
  type: 'public-key'
}

const ensureWebAuthnAvailable = (): void => {
  if (typeof window === 'undefined') {
    const error = new Error('Passkeys are not supported in this browser')
    error.name = 'NotSupportedError'
    throw error
  }

  if (!window.PublicKeyCredential || !navigator.credentials) {
    const error = new Error('Passkeys are not supported in this browser')
    error.name = 'NotSupportedError'
    throw error
  }

  if (!window.isSecureContext) {
    const error = new Error('Passkey authentication requires a secure context')
    error.name = 'SecurityError'
    throw error
  }
}

const bufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return window
    .btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

const base64UrlToBuffer = (value: string): ArrayBuffer => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  const binary = window.atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes.buffer
}

const normalizeRequestOptions = (
  options: PasskeyRequestOptionsJSON
): PublicKeyCredentialRequestOptions => {
  const allowCredentials =
    options.allowCredentials?.map((credential) => ({
      id: base64UrlToBuffer(credential.id),
      type: credential.type,
      transports: credential.transports,
    })) ?? []

  return {
    challenge: base64UrlToBuffer(options.challenge),
    timeout: options.timeout,
    rpId: options.rpId,
    allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
    userVerification: options.userVerification,
  }
}

const normalizeCreationOptions = (
  options: PasskeyCreationOptionsJSON
): PublicKeyCredentialCreationOptions => {
  const excludeCredentials =
    options.excludeCredentials?.map((credential) => ({
      id: base64UrlToBuffer(credential.id),
      type: credential.type,
      transports: credential.transports,
    })) ?? []

  return {
    challenge: base64UrlToBuffer(options.challenge),
    rp: options.rp,
    user: {
      ...options.user,
      id: base64UrlToBuffer(options.user.id),
    },
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout,
    attestation: options.attestation,
    excludeCredentials: excludeCredentials.length > 0 ? excludeCredentials : undefined,
    authenticatorSelection: options.authenticatorSelection,
  }
}

export const isWebAuthnSupported = (): boolean => {
  if (typeof window === 'undefined') return false
  return Boolean(window.PublicKeyCredential && navigator.credentials && window.isSecureContext)
}

export const startPasskeyAuthentication = async (
  options: PasskeyRequestOptionsJSON
): Promise<PasskeyAssertionJSON> => {
  ensureWebAuthnAvailable()
  const publicKey = normalizeRequestOptions(options)

  const credential = (await navigator.credentials.get({
    publicKey,
  })) as PublicKeyCredential | null

  if (!credential) {
    const error = new Error('Passkey authentication was cancelled or timed out')
    error.name = 'NotAllowedError'
    throw error
  }

  const response = credential.response as AuthenticatorAssertionResponse

  return {
    id: credential.id,
    rawId: bufferToBase64Url(credential.rawId),
    type: 'public-key',
    response: {
      authenticatorData: bufferToBase64Url(response.authenticatorData),
      clientDataJSON: bufferToBase64Url(response.clientDataJSON),
      signature: bufferToBase64Url(response.signature),
      userHandle: response.userHandle ? bufferToBase64Url(response.userHandle) : undefined,
    },
  }
}

export const startPasskeyRegistration = async (
  options: PasskeyCreationOptionsJSON
): Promise<PasskeyAttestationJSON> => {
  ensureWebAuthnAvailable()
  const publicKey = normalizeCreationOptions(options)

  const credential = (await navigator.credentials.create({
    publicKey,
  })) as PublicKeyCredential | null

  if (!credential) {
    const error = new Error('Passkey registration was cancelled or timed out')
    error.name = 'NotAllowedError'
    throw error
  }

  const response = credential.response as AuthenticatorAttestationResponse

  return {
    id: credential.id,
    rawId: bufferToBase64Url(credential.rawId),
    type: 'public-key',
    response: {
      attestationObject: bufferToBase64Url(response.attestationObject),
      clientDataJSON: bufferToBase64Url(response.clientDataJSON),
      transports: response.getTransports?.(),
    },
  }
}

export const getWebAuthnErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    switch (error.name) {
      case 'NotSupportedError':
        return 'Passkeys are not supported in this browser.'
      case 'NotAllowedError':
        return 'Passkey authentication was cancelled or timed out.'
      case 'SecurityError':
        return 'Security error during passkey authentication.'
      default:
        if (error.message) return error.message
    }
  }

  return 'Unable to complete passkey authentication.'
}
