"use client";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { clsx } from "clsx";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>();
  const [amountToUSD, setAmountToUSD] = useState<number>();
  const [arTokenPrice, setArTokenPrice] = useState<number>();
  const [voucherType, setVoucherType] = useState<"AR" | "Storage">("AR");

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    (async () => {
      await fetch(
        "https://api.redstone.finance/prices?symbol=AR&provider=redstone&limit=1"
      )
        .then((data) => data.json())
        .then((rate) => setArTokenPrice(rate[0].value));
    })();
  }, []);

  useEffect(() => {
    if (arTokenPrice && amount) {
      setAmountToUSD(amount * arTokenPrice);
    } else {
      setAmountToUSD(0);
    }
  }, [amount, arTokenPrice]);

  return (
    <main className="flex flex-col bg-[#131520] min-h-screen items-center justify-center gap-10 p-24">
      {/* <button className="px-4 py-2 rounded-md">
        <Link href={"/create"}>Create Voucher</Link>
      </button>
      <button className="px-4 py-2 rounded-md">
        <Link href={"/voucher"}>Reedem Voucher</Link>
      </button> */}
      <div className="w-[196px] h-[216px] relative">
        <Image
          className="w-full h-full"
          alt="hero"
          quality={70}
          fill
          src="/hero.png"
        />
      </div>
      <h1 className="font-medium text-2xl">Create your first voucher</h1>
      <button
        onClick={openModal}
        className="bg-[#E2694E] text-white rounded-lg py-4 px-6 font-medium"
      >
        + Create voucher
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md flex flex-col gap-10 transform overflow-hidden rounded-2xl bg-[#181B28] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-white"
                  >
                    Create your Voucher
                  </Dialog.Title>
                  <div className="flex flex-col items-start gap-2">
                    <p>Voucher Type</p>
                    <div className="flex bg-[#131520] p-1 rounded-lg">
                      <button
                        className={clsx(
                          "px-10 py-2 rounded-lg",
                          voucherType === "AR" &&
                            "bg-[#E2694E] bg-opacity-20 border-2 border-[#E2694E]"
                        )}
                        onClick={() => setVoucherType("AR")}
                      >
                        AR
                      </button>
                      <button
                        className={clsx(
                          "px-5 py-2 rounded-lg",
                          voucherType === "Storage" &&
                            "bg-[#E2694E] bg-opacity-20 border-2 border-[#E2694E]"
                        )}
                        onClick={() => setVoucherType("Storage")}
                      >
                        Storage
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <p>Amount</p>
                    <div className="flex gap-2">
                      <div className="relative flex w-full">
                        <input
                          className="w-full px-2 border-0 rounded-l-lg bg-[#1D2131] outline-0"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                        />
                        <p className="bg-[#131520] text-sm rounded-r-lg w-max p-2">
                          AR
                        </p>
                      </div>
                      <div className="relative flex w-6/12">
                        <input
                          disabled={true}
                          value={amountToUSD}
                          className="w-full px-2 border-0 rounded-l-lg bg-[#1D2131] outline-0"
                          type="text"
                        />
                        <p className="bg-[#131520] text-sm rounded-r-lg w-max p-2">
                          USD
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <p>No. of Voucher</p>
                    <div className="flex w-full gap-2">
                      <input
                        className="w-full px-2 py-2 border-0 rounded-lg bg-[#1D2131] outline-0"
                        type="number"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[#5A5F78]">
                      Calculated amt. is{" "}
                      <span className="text-white font-bold">$ 20</span>
                    </p>
                  </div>
                  <button className="bg-[#E2694E] text-white rounded-lg py-3 px-6 font-medium">
                    + Create voucher
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
}
