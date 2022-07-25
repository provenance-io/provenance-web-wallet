import { MessageSend } from 'types';
import { Message as MessageProto } from 'google-protobuf';
import {
  buildMessage,
  createAnyMessageBase64,
  msgAnyB64toAny,
  ReadableMessageNames,
} from '@provenanceio/wallet-utils';

export const getMessageAny = (
  txType: ReadableMessageNames,
  sendMessage: MessageSend
) => {
  const messageMsgSend = buildMessage(txType!, sendMessage);
  const messageB64String = createAnyMessageBase64(
    txType!,
    messageMsgSend as MessageProto
  );
  const msgAny = msgAnyB64toAny(messageB64String);

  return msgAny;
};
