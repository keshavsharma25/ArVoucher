function getOr(value, defaultVal) {
  if (value) {
    return value;
  }
  return defaultVal;
}

function result(data) {
  return { result: data };
}

async function createVoucher(state, caller) {
  const voucherHash = input.voucherHash;
  const amount = input.amount;
  const intermediary = input.intermediary;

  const allowResult = await SmartWeave.contracts.write(input.contractId, {
    function: "allow",
    intermediary: intermediary,
    amount: amount,
  });

  const expiryResult = await SmartWeave.contracts.write(input.contractId, {
    function: "setExpiry",
    expiry: input.expiry,
  });

  state.vouchers[voucherHash].push({
    owner: expiryResult.state.owner,
    contractId: input.contractId,
  });

  state.owners[caller].push(voucherHash);

  return { state };
}

async function cancelVoucher(state, caller) {
  const voucherHash = input.voucherHash;

  const voucher = getOr(getOr(state.owners[caller], {})[voucherHash], {});

  if (voucher) {
    const contractId = voucher[voucherHash];

    const result = await SmartWeave.contracts.write(contractId, {
      function: "cancel",
    });

    return { state };
  }
}

async function claimVoucher(state, caller) {
  const voucherHash = input.voucherHash;
  const voucher = getOr(state.vouchers[voucherHash], {});

  ContractAssert(voucher, "Voucher does not exist");

  const contractId = voucher.contractId;
  const result = await SmartWeave.contracts.write(contractId, {
    function: "claim",
    target: caller,
  });

  return { state };
}

async function getVoucherInfo(state) {
  const voucherHash = input.voucherHash;

  const voucher = getOr(state.vouchers[voucherHash], {});

  ContractAssert(voucher, "Voucher does not exist");

  const contractId = voucher.contractId;
  const contractState = await SmartWeave.contracts.readContractState(
    contractId
  );

  return { result: contractState };
}

async function vouchersByOwner(state) {
  const owner = input.owner;

  const vouchers = getOr(state.owners[owner], {});

  return result(vouchers);
}

async function voucherStatus(state) {
  const voucherHash = input.voucherHash;

  const voucher = getOr(state.vouchers[voucherHash], {});

  ContractAssert(voucher, "Voucher does not exist");

  const contractId = voucher.contractId;
  const contractState = await SmartWeave.contracts.readContractState(
    contractId
  );

  const isRedeemed = contractState.state.isRedeemed;
  const isValid = contractState.state.isValid;
  const owner = contractState.state.owner;
  const redeemer = contractState.state.redeemer;
  const expiry = contractState.state.expiry;
  const createdAt = contractState.state.createdAt;

  if (isRedeemed === true && isValid === false) {
    return result({
      status: "redeemed",
    });
  }

  if (isRedeemed === true && isValid === false && redeemer === owner) {
    return result({
      status: "cancelled",
    });
  }

  if (
    isRedeemed === false &&
    isValid === false &&
    expiry > SmartWeave.block.timestamp
  ) {
    return result({
      status: "expired",
    });
  }

  if (isRedeemed === false && isValid === true) {
    return result({
      status: "active",
    });
  }

  if (isRedeemed === false && isValid === false && expiry < createdAt) {
    return result({
      status: "cancelled",
    });
  }
}

export async function handler(state, action) {
  const input = action.input;
  const caller = action.caller;

  switch (input.function) {
    case "createVoucher":
      return await createVoucher(state, caller);
    case "cancelVoucher":
      return await cancelVoucher(state, caller);
    case "claimVoucher":
      return await claimVoucher(state, caller);
    case "getVoucherInfo":
      return await getVoucherInfo(state);
    case "vouchersByOwner":
      return await vouchersByOwner(state, input, caller);
    case "voucherStatus":
      return await voucherStatus(state);
    default:
      throw new ContractError(`Not a valid function. "${input.function}".`);
  }
}
