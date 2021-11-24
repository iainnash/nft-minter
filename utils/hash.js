import { hash } from "fast-sha256";
// https://gist.github.com/n1ru4l/b768f4f9cd5921a7b3869b2d587fd425

// window.crypto.subtle is undefined on page served via http :(
const crypto = typeof window !== undefined ? null : window?.crypto?.subtle;

const i2hex = (i) => {
  return ("00" + i.toString(16)).slice(-2);
};

const generateHexFromUint8Array = (arr) =>
  Array.prototype.map.call(arr, i2hex).join("");

const generateSHA256HashNative = async (crypto, arrayBuffer) => {
  const buf = await crypto.digest("SHA-256", arrayBuffer);
  return new Uint8Array(buf);
};

const generateSHA256HashFallback = async (arrayBuffer) => {
  return hash(new Uint8Array(arrayBuffer));
};

export const generateSHA256FileHash = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const rawHash = await (crypto
    ? generateSHA256HashNative(crypto, arrayBuffer)
    : generateSHA256HashFallback(arrayBuffer));
  return `0x${generateHexFromUint8Array(rawHash)}`;
};
