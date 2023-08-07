"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ArweaveWebWallet } from "arweave-wallet-connector";
import Arweave from "arweave";

const arweave = Arweave.init({});

export const ConnectWallet = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const { setAddress, address } = useAddress();
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  // const { setBalance } = useBalance();

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (address.length > 0) {
      arweave.wallets.getBalance(address).then((balance) => {
        let ar = arweave.ar.winstonToAr(balance);

        setBalance(ar);
      });
    }
  }, [address]);

  const openModal = () => {
    setIsOpen(true);
  };

  const arConnect = async () => {
    if (!window.arweaveWallet) {
      window.open("https://arconnect.io");
    }

    try {
      await window.arweaveWallet.disconnect();
      await window.arweaveWallet.connect(
        ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"],
        { name: "img" }
      );
      const addr = await window.arweaveWallet.getActiveAddress();
      setAddress(addr);
      setIsOpen(false);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const arwallet = async () => {
    try {
      const wallet = new ArweaveWebWallet({
        name: "pages",
      });
      wallet.setUrl("arweave.app");
      await wallet.connect();

      const addr = await window.arweaveWallet.getActiveAddress();
      setAddress(addr);
      setIsOpen(false);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-lg bg-[#E2694E] text-white px-4 py-2 text-sm font-medium ml-auto hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          {address ? address : "Connect"}
        </button>
      </div>

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
                <Dialog.Panel className="w-full max-w-md flex flex-col gap-10 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Connect Wallet
                  </Dialog.Title>
                  <button
                    onClick={arConnect}
                    className="bg-black px-10 py-2 rounded-md"
                  >
                    ArConnect
                  </button>
                  <button
                    onClick={arwallet}
                    className="bg-black px-10 py-2 rounded-md"
                  >
                    Arweave.app
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
