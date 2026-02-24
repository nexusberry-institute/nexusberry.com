// Rotating XOR key (not a secret — obfuscation only)
const KEY = 'NxB3rry!V1d'

function xorTransform(input: string): string {
  return Array.from(input)
    .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ KEY.charCodeAt(i % KEY.length)))
    .join('')
}

// Server: JSON → XOR → base64 string
export function encodeVideoPayload(data: unknown): string {
  const json = JSON.stringify(data)
  return btoa(xorTransform(json))
}

// Client: base64 → XOR → JSON
export function decodeVideoPayload(encoded: string): unknown {
  const xored = atob(encoded)
  return JSON.parse(xorTransform(xored))
}
