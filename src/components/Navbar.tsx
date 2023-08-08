import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";
import { MouseEventHandler } from "react";

type NavbarType = {
  onReedmedClick: MouseEventHandler<HTMLSpanElement>;
};

export const Navbar = ({ onReedmedClick }: NavbarType) => {
  return (
    <nav className="bg-[#181B28] fixed top-0 w-screen py-3 flex justify-between items-center px-10">
      <h1 className="font-bold flex justify-center items-center gap-10 text-xl">
        <Link href={"/"}>ArVoucher</Link>
        <div className="h-10 w-[1px] bg-white opacity-10"></div>
        <div className="flex justify-center items-center gap-5">
          <span className="font-normal text-base cursor-pointer hover:text-[#E2694E]">
            Vouchers
          </span>

          <span
            onClick={onReedmedClick}
            className="font-normal cursor-pointer text-base hover:text-[#E2694E]"
          >
            Redeem Voucher
          </span>
        </div>
      </h1>
      <ConnectWallet />
    </nav>
  );
};
