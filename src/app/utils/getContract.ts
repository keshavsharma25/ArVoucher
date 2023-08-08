import { WarpFactory } from "warp-contracts";

export const warp = WarpFactory.forMainnet();

export async function getContract(transactionId: string) {
  const contract = await warp.contract(transactionId).connect("use_wallet");
  return contract;
}
