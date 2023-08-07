"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type AddressStateType = {
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
};

type BalanceStateType = {
  balance: string | undefined;
  setBalance: Dispatch<SetStateAction<string | undefined>>;
};

const AddressStateContext = createContext<AddressStateType | undefined>(
  undefined
);
const BalanceStateContext = createContext<BalanceStateType | undefined>(
  undefined
);

export const AccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>();

  return (
    <AddressStateContext.Provider value={{ address, setAddress }}>
      <BalanceStateContext.Provider
        value={{ balance, setBalance }}
      ></BalanceStateContext.Provider>
    </AddressStateContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressStateContext);
  if (!context) {
    throw new Error("useAddress must be used within a AddressStateProvider");
  }
  return context;
};

export const useBalance = () => {
  const context = useContext(BalanceStateContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceStateProvider");
  }
  return context;
};
