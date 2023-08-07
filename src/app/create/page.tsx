"use client";

import { FormEvent, useEffect, useState } from "react";
import { clsx } from "clsx";

export default function Home() {
  const [voucherType, setVoucherType] = useState<"AR" | "Storage">("AR");
  const [arTokenPrice, setArTokenPrice] = useState<number | null>(null);
  const [vouchersPrice, setVouchersPrice] = useState<number>();
  const [amount, setAmount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);

  const formSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    (async () => {
      await fetch(
        "https://api.redstone.finance/prices?symbol=AR&provider=redstone&limit=1"
      )
        .then((data) => data.json())
        .then((rate) => console.log("rate: ", setArTokenPrice(rate[0].value)));
    })();
  }, []);

  useEffect(() => {
    if (arTokenPrice) {
      setVouchersPrice(amount * arTokenPrice);
    }
  }, [amount, arTokenPrice]);

  useEffect(() => {
    if (vouchersPrice) {
      setCalculatedAmount(vouchersPrice * quantity);
    }
  }, [vouchersPrice, quantity]);

  return (
    <div className="h-screen w-screen">
      <h1 className="text-2xl font-bold">Create Your Voucher</h1>
      <form
        className="mt-14 w-6/12 mx-auto p-10 rounded-md justify-start start-center flex flex-col gap-5"
        onSubmit={formSubmit}
      >
        <div className="flex items-center gap-10">
          <p>Voucher Type</p>
          <div className="flex">
            <button
              className={clsx(
                "bg-slate-300 rounded-l-md px-2 py-1",
                voucherType === "AR" && "bg-slate-400"
              )}
              onClick={() => setVoucherType("AR")}
            >
              AR
            </button>
            <button
              className={clsx(
                "bg-slate-300 rounded-r-md px-2 py-1",
                voucherType === "Storage" && "bg-slate-400"
              )}
              onClick={() => setVoucherType("Storage")}
            >
              Storage
            </button>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <p>Amount</p>
          <div className="flex gap-2">
            <div className="relative flex w-full">
              <input
                className="w-full px-2 border border-black outline-0"
                type="number"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <p className="bg-slate-300 w-max p-2">AR</p>
            </div>
            <div className="relative flex w-6/12">
              <input
                disabled={true}
                value={vouchersPrice}
                className="w-full border px-2 border-black"
                type="text"
              />
              <p className="bg-slate-300 w-max p-2">USD</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <p>Numbers of voucher</p>

          <div className="relative flex w-3/12">
            <input
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full outline-0 px-2 border border-black"
              type="number"
            />
          </div>
        </div>
        <div className="flex gap-10">
          <p>Calculated Amount</p>

          <div className="relative flex w-3/12">
            <input
              disabled={true}
              className="w-full px-2 border border-black"
              type="number"
              value={calculatedAmount}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-max bg-black px-4 py-2 text-white rounded-md"
        >
          Create
        </button>
      </form>
    </div>
  );
}
