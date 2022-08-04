import { BIP32Interface as _BIP32Interface } from 'bip32';
import type {
  Bech32String as _Bech32String,
  Bytes as _Bytes,
} from '@tendermint/types';
import {
  MsgSendDisplay,
  MsgExecuteContractParams,
  MsgGrantDisplay,
  MsgVerifyInvariantDisplay,
  MsgSetWithdrawAddressDisplay,
  MsgWithdrawDelegatorRewardDisplay,
  MsgWithdrawValidatorCommissionDisplay,
  MsgFundCommunityPoolDisplay,
  MsgSubmitEvidenceDisplay,
  MsgSubmitProposalDisplay,
  MsgVoteDisplay,
  MsgVoteWeightedDisplay,
  MsgDepositDisplay,
  MsgUnjailDisplay,
  MsgCreateValidatorDisplay,
  MsgEditValidatorDisplay,
  MsgDelegateDisplay,
  MsgBeginRedelegateDisplay,
  MsgUndelegateDisplay,
  MsgCreateVestingAccountDisplay,
  SupportedDenoms,
  CoinAsObject as _CoinAsObject,
} from '@provenanceio/wallet-utils';

export type BIP32Interface = _BIP32Interface;
export type Bech32String = _Bech32String;
export type Bytes = _Bytes;

export type MessageSend =
  | MsgSendDisplay
  | MsgExecuteContractParams
  | MsgGrantDisplay
  | MsgVerifyInvariantDisplay
  | MsgSetWithdrawAddressDisplay
  | MsgWithdrawDelegatorRewardDisplay
  | MsgWithdrawValidatorCommissionDisplay
  | MsgFundCommunityPoolDisplay
  | MsgSubmitEvidenceDisplay
  | MsgSubmitProposalDisplay
  | MsgVoteDisplay
  | MsgVoteWeightedDisplay
  | MsgDepositDisplay
  | MsgUnjailDisplay
  | MsgCreateValidatorDisplay
  | MsgEditValidatorDisplay
  | MsgDelegateDisplay
  | MsgBeginRedelegateDisplay
  | MsgUndelegateDisplay
  | MsgCreateVestingAccountDisplay;

export interface CreateWalletProps {
  privateKeyB64: string;
  publicKeyB64: string;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
  address: string;
}

export interface GetTxFeeEstimate {
  publicKey: string;
  msgAny: any | any[];
  address: string;
  gasPrice?: number;
  gasPriceDenom?: SupportedDenoms;
  gasAdjustment?: number;
}

export type CoinAsObject = _CoinAsObject;

export interface GetTxFeeEstimateResponse {
  txFeeEstimate: CoinAsObject[];
  txGasEstimate: number;
}
