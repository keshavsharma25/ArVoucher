import { useMemo } from "react";

type VoucherType = {
  hash?: string;
  createdAt: string;
  expiry: string;
  amount: string;
  isReedemd: boolean;
};

export const Voucher = ({
  hash,
  createdAt,
  amount,
  expiry,
  isReedemd,
}: VoucherType) => {
  let h = Math.floor(Math.random() * 360);
  const HSLToRGB = useMemo(() => {
    let s = 50 / 100;
    let l = 10 / 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return `rgb(${255 * f(0)},${255 * f(8)},${255 * f(4)})`;
  }, [h]);
  return (
    <div className="bg-[#181B28] p-5 rounded-2xl flex flex-col gap-2">
      <h1 className="text-[#5A5F78]">
        Voucher_Hash: <span className="text-[#E2694E]">{hash}</span>
      </h1>
      <div
        style={{ background: `${HSLToRGB}` }}
        className={`w-52 rounded-lg overflow-hidden bg-10 relative`}
      >
        <img src="/voucherbg.png" alt="background" />
        <img
          className="absolute w-2/4 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
          src="/voucherCoupon.png"
          alt="voucher"
        />
        {isReedemd && (
          <div className="bg-[#131520] bg-opacity-80 py-3 w-full absolute left-0 top-2/4 -translate-y-2/4 text-center">
            Redeemed
          </div>
        )}
      </div>
      <div className="flex justify-center items-center gap-3">
        <div>
          <h1 className="text-[#5A5F78] text-xs">Created:</h1>
          <p className="font-thin">{createdAt}</p>
        </div>
        <div>
          <h1 className="text-[#5A5F78] text-xs">Expiry:</h1>
          <p className="font-thin">{expiry}</p>
        </div>
        <div>
          <h1 className="text-[#5A5F78] text-xs">Amt:</h1>
          <p className="font-thin">${amount}</p>
        </div>
      </div>
    </div>
  );
};
