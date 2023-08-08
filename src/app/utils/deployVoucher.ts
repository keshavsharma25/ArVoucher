import { NodeBundlr } from "@bundlr-network/client";
import { encryptWallet } from "./generateWallet";
import { warp } from "./getContract";

type State = {
  voucherHash: string;
  owner: string;
  redeemer: string;
  intermediary: string;
  mainContract: string;
  isRedeemed: boolean;
  isValid: boolean;
  createdAt: Number;
  expiry: Number;
  amount: Number;
};

export async function atomicAssetDeploy(
  contractSrc: string,
  jwk: any,
  voucherId: string,
  state: {
    voucherHash: string;
    owner: string;
    redeemer: string;
    intermediary: string;
    mainContract: string;
  } & Partial<State>
) {
  const { voucherHash, owner, redeemer, intermediary, mainContract } = state;

  const initialState: State = {
    voucherHash,
    owner,
    redeemer,
    intermediary,
    mainContract,
    isRedeemed: false,
    isValid: true,
    createdAt: Number(Date.now().toString()),
    expiry: 0,
    amount: 0,
  };

  const contractTags = [
    {
      name: "Content-Type",
      value: "text/plain",
    },
    { name: "App-Name", value: "SmartWeaveContract" },
    { name: "App-Version", value: "0.3.0" },
    {
      name: "Contract-Src",
      value: contractSrc,
    },
    {
      name: "Init-State",
      value: JSON.stringify(initialState),
    },
    {
      name: "Title",
      value: voucherHash,
    },
    {
      name: "Description",
      value: `Voucher Contract for ${voucherHash} created by ${owner}`,
    },
    {
      name: "Type",
      value: "Atomic",
    },
    {
      name: "Indexed-By",
      value: "atomic-asset",
    },
  ];

  const bundlr = new NodeBundlr("https://node2.bundlr.network", "arweave", jwk);
  const encryptedData = await encryptWallet(jwk, voucherId);

  const tx = await bundlr.upload(encryptedData, { tags: contractTags });

  const { contractTxId } = await warp.register(tx.id, "node2");

  return {
    contractTxId,
  };
}
