import { WarpFactory } from "warp-contracts";
import { DeployPlugin } from "warp-contracts-plugin-deploy";

const warp = WarpFactory.forMainnet().use(new DeployPlugin());

export async function generateWallet() {
  const { jwk } = await warp.generateWallet();
  return jwk;
}
