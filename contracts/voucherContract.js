/**
 * The `ContractErrors` object is a collection of error functions that are used to create specific
 * error messages. Each error function takes in one or more parameters and returns a new
 * `ContractError` object with a formatted error message.
 */
const ContractErrors = {
  RuntimeError: (message) => new ContractError(`[RE:RE] ${message}`),
  CallerBalanceNotEnough: (amount) =>
    new ContractError(`[CE:CallerBalanceNotEnough ${amount}]`),
  CallerAllowanceNotEnough: (amount) =>
    new ContractError(`[CE:CallerAllowanceNotEnough ${amount}]`),
  AllowanceHasToGtThenZero: () =>
    new ContractError(`[CE:AllowanceHasToGtThenZero]`),
};

/**
 * The `isAddress` function is a validation function that checks if a given value is a non-empty
 * string. It takes two parameters: `value` and `name`.
 */
var isAddress = (value, name) => {
  if (!(typeof value === "string" && value !== "")) {
    throw ContractErrors.RuntimeError(
      `Validation error: "${name}" has to be non-empty string`
    );
  }
};

/**
 * The function returns the value if it exists, otherwise it returns a default value.
 * @param value - The value parameter is the value that you want to check if it exists or not.
 * @param defaultVal - The default value is the value that will be returned if the first parameter,
 * value, is falsy (i.e., null, undefined, false, 0, NaN, or an empty string).
 * @returns the value if it is truthy (not null, undefined, false, 0, NaN, or an empty string),
 * otherwise it returns the default value.
 */
function getOr(value, defaultVal) {
  if (value) {
    return value;
  }
  return defaultVal;
}

/**
 * The function "result" returns an object with a property "result" that contains the input data.
 * @param data - The parameter "data" is a variable that represents the input data that will be
 * returned as the result.
 * @returns an object with a property called "result" that contains the value of the "data" parameter.
 */
function result(data) {
  return { result: data };
}

/**
 * The function `claim` is used to redeem a voucher by transferring the voucher amount from an
 * intermediary to the caller and marking the voucher as redeemed.
 * @param state - The `state` parameter represents the current state of the contract. It contains
 * information about the voucher being claimed, such as whether it has already been redeemed and the
 * amount of the voucher.
 * @param caller - The `caller` parameter represents the address of the account that is calling the
 * `claim` function.
 * @returns an object with a single property "state", which contains the updated state after the
 * claim is made.
 */
function claim(state, caller) {
  const isRedeemed = state.isRedeemed;
  const isValid = state.isValid;

  const target = input.target;

  isAddress(target, "target");
  if (target !== caller) {
    throw ContractErrors.RuntimeError("Only target can claim");
  }

  if (isRedeemed && !isValid)
    throw new ContractErrors.RuntimeError("Voucher is already claimed");

  if (!isRedeemed && !isValid && state.expiry === -1)
    throw ContractErrors.RuntimeError(
      "Voucher is not valid as its cancelled by owner"
    );

  const intermediary = state.intermediary;
  isAddress(intermediary, "intermediary");

  state = _transfer(state, intermediary, target, state.amount);

  state.isRedeemed = true;
  state.isValid = false;
  state.redeemer = target;

  return { state };
}

/**
 * The function allows the owner to transfer a specified quantity of a token to an intermediary
 * address.
 * @param state - The state parameter represents the current state of the contract. It contains
 * information about the owner, intermediary, and amount.
 * @param caller - The `caller` parameter represents the address of the account or contract that is
 * calling the `allow` function.
 * @returns an object with a single property "state", which contains the updated state after the
 * transfer and allowance operation.
 */
function allow(state, caller) {
  const owner = state.owner;
  isAddress(owner, "owner");

  if (owner !== caller)
    throw ContractErrors.RuntimeError("Only owner can allow");

  ContractAssert(input.intermediary, "intermediary is required");
  ContractAssert(input.amount, "amount is required");

  const intermediary = input.intermediary;
  isAddress(intermediary, "intermediary");

  const amount = input.amount;
  isUInt(amount, "amount");

  if (amount === 0) {
    throw ContractErrors.AllowanceHasToGtThenZero();
  }

  state = _transfer(state, owner, intermediary, amount);

  state.intermediary = intermediary;

  if (to === owner && state.amount === 0) {
    state.amount = amount;
    state.createdAt = SmartWeave.block.timestamp;
  } else if (to === owner && state.amount !== 0) {
    state.amount += amount;
  }

  return { state };
}

/**
 * The function cancels a contract if the caller is the owner.
 * @param state - The `state` parameter represents the current state of the contract. It contains
 * information about the contract's owner, expiry date, and validity status.
 * @param caller - The `caller` parameter represents the address of the account that is calling the
 * `cancel` function.
 * @returns an object with the updated state.
 */
function cancel(state, caller) {
  const owner = state.owner;

  isAddress(owner, "owner");

  if (owner !== caller)
    throw ContractErrors.RuntimeError("Only owner can cancel");

  state = _transfer(state, owner, intermediary, state.amount);

  state.expiry = -1;
  state.isValid = false;

  return { state };
}

/**
 * The function "isRedeemed" checks if a given state is redeemed and returns the result.
 * @param state - The `state` parameter is an object that contains information about the redemption
 * status. It has a property `isRedeemed` which indicates whether the redemption has been completed or
 * not.
 * @returns an object with a property called "isRedeemed" which is set to the value of the "isRedeemed"
 * property from the "state" object.
 */
function isRedeemed(state) {
  return result({
    isRedeemed: state.isRedeemed,
  });
}

/**
 * The function "check_allowance" checks the allowance balance of an intermediary in a state object.
 * @param state - The `state` parameter is an object that contains the current state of the contract.
 * It includes the `intermediary` and `balances` properties.
 * @param caller - The `caller` parameter represents the address of the account that is calling the
 * `check_allowance` function.
 * @returns an object with two properties: "intermediary" and "allowance". The value of "intermediary"
 * is the value of the "intermediary" variable, and the value of "allowance" is the value of the
 * "balance" variable.
 */
function check_allowance(state) {
  const intermediary = state.intermediary;
  const balances = state.balances;

  const balance = getOr(balances[intermediary], 0);

  isAddress(intermediary, "intermediary");
  ContractAssert(typeof balance === "number", "Balance has to be a number");

  return result({
    voucherHash: state.voucherHash,
    intermediary: intermediary,
    allowance: balance,
  });
}

/**
 * The function `getBalance` returns the balance of a target address in a given state, or the balance
 * of the caller if the target address is the same as the caller.
 * @param state - The `state` parameter represents the current state of the system, which includes
 * information such as account balances.
 * @param caller - The `caller` parameter represents the address of the caller, i.e., the address of
 * the account that is making the function call.
 * @returns an object with the properties "target" and "balance". The value of "target" is either the
 * input "target" or the value of "caller", depending on whether "caller" is equal to "target". The
 * value of "balance" is the value of "balances[target]" if "caller" is not equal to "target", or the
 * value of "balances[
 */
function getBalance(state, input, caller) {
  const target = input.target;
  const balances = state.balances;

  isAddress(target, "target");

  if (caller !== target) {
    return result({
      target: target,
      balance: getOr(balances[target], 0),
    });
  }

  return result({
    voucherHash: state.voucherHash,
    target: caller,
    balance: getOr(balances[caller], 0),
  });
}

/**
 * The function "getOwner" returns an object containing the owner property from the given state object.
 * @param state - The `state` parameter is an object that represents the current state of something. It
 * likely contains various properties and values that are relevant to the context in which the
 * `getOwner` function is being used.
 * @returns an object with a property "owner" that is equal to the value of the "owner" property in the
 * "state" object.
 */
function getOwner(state) {
  return result({
    voucherHash: state.voucherHash,
    owner: state.owner,
  });
}

/**
 * The function sets the expiry date for a contract, but only allows the owner to do so.
 * @param state - The state parameter represents the current state of the contract. It contains
 * information about the contract's variables and their values.
 * @param caller - The `caller` parameter represents the address of the account that is calling the
 * `setExpiry` function.
 * @returns an object with a "state" property, which contains the updated state object with the new
 * expiry value.
 */
function setExpiry(state, caller) {
  const owner = state.owner;
  const createdAt = state.createdAt;

  isAddress(owner, "owner");

  if (owner !== caller)
    throw ContractErrors.RuntimeError("Only owner can set expiry");

  expiry = input.expiry;
  isUInt(expiry, "expiry");

  if (expiry === 0) {
    throw ContractErrors.ExpiryHasToGtThenZero();
  }

  state.expiry = createdAt + expiry;

  return { state };
}

/**
 * The function transfers a specified amount of a token from one account to another, updating the
 * balances accordingly.
 * @param state - The `state` parameter represents the current state of the contract. It contains
 * information such as balances, addresses, and other relevant data.
 * @param to - The `to` parameter represents the address of the recipient of the transfer.
 * @param from - The `from` parameter represents the address of the account from which the transfer is
 * being made.
 * @param amount - The amount parameter represents the amount of a certain asset or currency that is
 * being transferred from one account (from) to another account (to).
 * @returns an object with a single property "state", which contains the updated state after the
 * transfer operation.
 */
function _transfer(state, to, from, amount) {
  const balances = state.balances;
  const fromBalance = getOr(balances[from], 0);

  if (fromBalance < amount) {
    throw ContractErrors.CallerBalanceNotEnough(fromBalance);
  }

  const newFromBalance = fromBalance - amount;

  if (newFromBalance === 0) {
    delete balances[from];
  } else {
    balances[from] = newFromBalance;
  }

  let toBalance = getOr(balances[to], 0);
  balances[to] = toBalance + amount;

  state.balances = balances;

  return { state };
}

/**
 * The function "handle" takes in a state and an action, and based on the input function specified in
 * the action, it calls the corresponding function to perform a specific action on the state.
 * @param state - The `state` parameter represents the current state of the contract. It contains all
 * the data and variables that are relevant to the contract's functionality.
 * @param action - The `action` parameter is an object that contains information about the action being
 * performed. It has two properties:
 * @returns The function `handle` returns the result of calling one of the following functions:
 * `claim`, `allow`, `isRedeemed`, `getBalance`, `check_allowance`, or `getOwner`. The specific
 * function that is called depends on the value of `input.function` provided in the `action` parameter.
 */
export function handler(state, action) {
  const input = action.input;
  const caller = action.caller;

  switch (input.function) {
    case "claim":
      return claim(state, caller);
    case "allow":
      return allow(state, caller);
    case "cancel":
      return cancel(state, caller);
    case "isRedeemed":
      return isRedeemed(state);
    case "getBalance":
      return getBalance(state, caller);
    case "check_allowance":
      return check_allowance(state, caller);
    case "getOwner":
      return getOwner(state, caller);
    case "setExpiry":
      return setExpiry(state, caller);

    default:
      throw new ContractError(`Not a valid function. "${input.function}".`);
  }
}
