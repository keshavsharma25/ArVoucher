import { WarpFactory } from "warp-contracts";
import { DeployPlugin } from "warp-contracts-plugin-deploy";

export const warp = WarpFactory.forMainnet().use(new DeployPlugin());

export async function getContract(transactionId: string) {
  const contract = await warp.contract(transactionId).connect("use_wallet");
  return contract;
}
