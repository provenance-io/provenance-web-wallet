import { PROVENANCE_MESSAGE_FEES_URL } from 'consts';

interface MsgFeesResult {
  denom: string;
  amount: string;
}
interface ProvenanceMsgFees {
  params: {
    floor_gas_price: MsgFeesResult;
    nhash_per_usd_mil: string;
  };
}

export const getDefaultMsgFees = async (): Promise<MsgFeesResult> => {
  const msgFees = await fetch(PROVENANCE_MESSAGE_FEES_URL)
    .then((response) => response.json())
    .then((data: ProvenanceMsgFees) => data);
  const denom = msgFees?.params?.floor_gas_price?.denom || 'nhash';
  const amount = msgFees?.params?.floor_gas_price?.amount || '1905';
  return { denom, amount };
};
