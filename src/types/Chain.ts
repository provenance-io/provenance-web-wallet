import { BIP32Interface as BIP32InterfaceImport } from 'bip32';
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
} from '@provenanceio/wallet-utils';

export type BIP32Interface = BIP32InterfaceImport;

export type MessageSend = MsgSendDisplay | MsgExecuteContractParams | MsgGrantDisplay | MsgVerifyInvariantDisplay | MsgSetWithdrawAddressDisplay | MsgWithdrawDelegatorRewardDisplay | MsgWithdrawValidatorCommissionDisplay | MsgFundCommunityPoolDisplay | MsgSubmitEvidenceDisplay | MsgSubmitProposalDisplay | MsgVoteDisplay | MsgVoteWeightedDisplay | MsgDepositDisplay | MsgUnjailDisplay | MsgCreateValidatorDisplay | MsgEditValidatorDisplay | MsgDelegateDisplay | MsgBeginRedelegateDisplay | MsgUndelegateDisplay | MsgCreateVestingAccountDisplay;
