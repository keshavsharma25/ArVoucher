import { WarpFactory } from "warp-contracts";
import { DeployPlugin } from "warp-contracts-plugin-deploy";
import { AES, enc } from "crypto-js";

const warp = WarpFactory.forMainnet().use(new DeployPlugin());

export async function generateWallet() {
  const { jwk } = await warp.generateWallet();
  return jwk;
}

export async function encryptWallet(jwk: any, seed: string) {
  const encrypted = AES.encrypt(JSON.stringify(jwk), seed).toString();
  return encrypted;
}

export async function decryptWallet(encrypted: string, seed: string) {
  const decrypted = AES.decrypt(encrypted, seed);
  return JSON.parse(decrypted.toString(enc.Utf8));
}
