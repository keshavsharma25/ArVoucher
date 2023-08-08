import { getContract, warp } from "./getContract";

export async function claim(voucherHash: string) {
  const contract = await warp
    .contract("9aIjT-6ExptnqHB0nyIxPqDZwA-E9WGx7KiYGv16L4I")
    .setEvaluationOptions({
      internalWrites: true,
    })
    .connect("use_wallet");

  const result = await contract.writeInteraction({
    function: "claimVoucher",
    data: {
      voucherHash,
    },
  });

  return result;
}
