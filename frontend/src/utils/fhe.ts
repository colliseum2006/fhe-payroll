// Convert bytes to hex string
export const toHexString = (bytes: Uint8Array, with0x = false) =>
  `${with0x ? '0x' : ''}${bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, '0'),
    '',
  )}`;

// Convert hex string to bytes
export const fromHexString = (hexString: string): Uint8Array => {
  const arr = hexString.replace(/^(0x)/, '').match(/.{1,2}/g);
  if (!arr) return new Uint8Array();
  return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
}; 