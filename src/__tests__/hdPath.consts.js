// Main Testing Seed
export const seed = 'bleak alpha bunker give message direct powder general issue awesome animal ice entry parade invest sausage tragic away nuclear gaze learn during crew benefit';
export const walletPrefix = 'tp';
// Various account levels
const rootLevelData = {
  hdPath: 'm',
  hdPathNewAccount: "44'/1'/0'/0'/0'",
  address: 'pb1mpk5vhaw4lppuzfj0z4kxrdxwy4ec4ghjt2wt2',
  publicKey: 'A4wgmrjttj2LrRG8v8ATWpEkFfz+vBp4QpEQ+5UwaHPJ',
  privateKey: 'yupA356m1veOWjcOo7rJw0XA/vxsn/jvdYf7xsW9RhE=',
  masterKey: 'xprv9s21ZrQH143K4aJhHV2VvbkDyWKK4RSkipQEqrJoYue2MWtSHApcMhwKiS8zTv39GEPxp9bVC3iyUBvmpmG2PcZoFQzs2wkZzsNj9pVy2Jg'
}
const purposeLevelData = {
  hdPath: "m/44'",
  hdPathNewAccount: "1'/0'/0'/0'",
  address: 'pb1kftrf2sgrk4rk57yqcgt3yekknlmyrpkayendw',
  publicKey: 'A3N2BZrdYcP1r1fQRGvONdxRBJjjAeedijhcg5G/sFnf',
  privateKey: 'HeeW7F0R2qAp+DTEVDSNodOXl2hrVeDgXMqeXX2HaSs=',
  masterKey: 'xprv9vVQoEiLn4SkWfhCF9jt9L8Bs98S5Fiuqsbfwxo5FGttQTQZ8DoDJiQnJcFCpnPxagfgd7QWba88uxJGirLKKwfhud8ddp1KmLHM8dAjcnB',
}
const coinTypeLevelData = {
  hdPath: "m/44'/1'",
  hdPathNewAccount: "0'/0'/0'",
  address: 'tp1rdv5quhluxd7myve779klvppz8ghdtl0wylfre',
  publicKey: 'A35d9SX8Q4cKZ1mft58E2uh54jZDiwogAj6rP2hoD/NF',
  privateKey: 'TKiDDbtCtHJR+WYE9PFigHe4TeqacJlCIXJdSLk0gr4=',
  masterKey: 'xprv9x6JqfVq13gNMYhGcfgEaAeaTmZDTdjJXJZYAh6snz63EFxVD1VX7qbNWZY1pZabCsdQmDFE5CzZVWvfDwnVrxvLkgtz46Auy8qX3DQvMbt',
}
const accountLevelData = {
  hdPath: "m/44'/1'/0'",
  hdPathNewAccount: "0'/0'",
  address: 'tp10r05xakfulqu5dq7jtc70edz3slc066zqaantl',
  publicKey: 'AueRlGlozfcSMMu/p9Ks5I2V5HK2LIYlbsbzNEpms4Xt',
  privateKey: '+1QY1QqEnTmqFl6ph1gv5rua02DBXG13SmXN9UPWIjM=',
  masterKey: 'xprv9xs5N8Aq32P76THv7rPGQrZ8LhwhV2Y2zKwDYFTMyig6YR9eXuEt367BGYLB6So88NmJgy9rbYL3McyC2yVfJAC7ULuFc8XnRpguhvUPQZ7',
}
const changeLevelData = {
  hdPath: "m/44'/1'/0'/0'",
  hdPathNewAccount: "0'",
  address: 'tp1h9ateh0znux20c44n99zw34l8kud4gydesxszj',
  publicKey: 'Aztjvb7Pn+Te38xi2iJTeRmOAZ6aJKOvk0aQYas0brrn',
  privateKey: 'rQFXnXGW5cE+ShbLmWz387hBCL9MsnuJCbj/le5wea8=',
  masterKey: 'xprvA1S5gjb51K44Tk2oogymbGkrJ5PEMrcHQSm79RtPC1G8jiYRLffpKW3nendaabqs9ow1dy2oRtmqTHithhe3UKmtuAt87DJCBcBcV2bbsUx',
}
const addressIndexLevelData = {
  hdPath: "m/44'/1'/0'/0'/0'",
  address: 'tp1l3t9dlsmqrktm6z9wjhedewc5e2jz0lll807pw',
  publicKey: 'A22+mXaYkJT+FGYEbwwk6jKpcbtXJBAf/fC1keiXNTY1',
  privateKey: 'ospOVWP/MqsE1J+QFYUNC51W8DOTvOGKIqlmfHiRbLA=',
  masterKey: 'xprvA3nm2RvjwJ1e72dX4dfFwESssoLaSYPUgcvH9BcR1TM3Ct5xSUyouXHuT1Nar2ypYLUtfpn7fEAvxdbznjDtr4i3XXbhVdDeLzBhDzEMw2m',
}
// Combine and export all account level data
export const allAccountLevels = {
  root: rootLevelData,
  purpose: purposeLevelData,
  coinType: coinTypeLevelData,
  account: accountLevelData,
  change: changeLevelData,
  addressIndex: addressIndexLevelData,
};

// Various HD path data
const hdPathDataAddressIndex = {
  accountLevel: 'addressIndex',
  root: { display: 'm', value: 'm', hardened: false },
  purpose: { display: "44'", value: 44, hardened: true },
  coinType: { display: "1'", value: 1, hardened: true },
  account: { display: "0'", value: 0, hardened: true },
  change: { display: "0'", value: 0, hardened: true },
  addressIndex: { display: "0'", value: 0, hardened: true },
};
const hdPathDataChange = {
  accountLevel: 'change',
  root: { display: 'm', value: 'm', hardened: false },
  purpose: { display: "44'", value: 44, hardened: true },
  coinType: { display: "1'", value: 1, hardened: true },
  account: { display: "0'", value: 0, hardened: true },
  change: { display: "0'", value: 0, hardened: true },
};
const hdPathDataAccount = {
  accountLevel: 'account',
  root: { display: 'm', value: 'm', hardened: false },
  purpose: { display: "44'", value: 44, hardened: true },
  coinType: { display: "1'", value: 1, hardened: true },
  account: { display: "0'", value: 0, hardened: true },
};
const hdPathDataCoinType = {
  accountLevel: 'coinType',
  root: { display: 'm', value: 'm', hardened: false },
  purpose: { display: "44'", value: 44, hardened: true },
  coinType: { display: "1'", value: 1, hardened: true },
};
const hdPathDataPurpose = {
  accountLevel: 'purpose',
  root: { display: 'm', value: 'm', hardened: false },
  purpose: { display: "44'", value: 44, hardened: true },
};
const hdPathDataRoot = {
  accountLevel: 'root',
  root: { display: 'm', value: 'm', hardened: false },
};
export const allHDPathData = {
  root: hdPathDataRoot,
  purpose: hdPathDataPurpose,
  coinType: hdPathDataCoinType,
  account: hdPathDataAccount,
  change: hdPathDataChange,
  addressIndex: hdPathDataAddressIndex,
};
