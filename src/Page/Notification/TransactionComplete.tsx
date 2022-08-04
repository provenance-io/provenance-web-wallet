import { Typo, List, Content, BottomFloat, Button, FullData } from 'Components';
import styled from 'styled-components';
import { hashFormat, txMessageFormat } from 'utils';
import checkSuccessIcon from 'images/check-success.svg';
import { useWalletConnect } from 'redux/hooks';

interface Amount {
  amount: string | number;
  denom: string;
}
interface Props {
  pageData: {
    result?: {
      amount?: string | number | Amount;
      denom?: string;
      platform?: string;
    };
  };
  closeWindow: () => void;
}

const SuccessIcon = styled.img`
  height: 80px;
  width: 80px;
  display: flex;
  margin: 0 auto;
  margin-top: 30px;
`;

export const TransactionComplete: React.FC<Props> = ({ pageData, closeWindow }) => {
  const { connector } = useWalletConnect();
  const { result = '' } = pageData;
  const renderTxData = () => {
    if (result) {
      // Clone targetTx to make changes if needed
      const finalTxData = { ...result };
      // If we have both amount and denom, combine into object and remove individual
      if (finalTxData.amount && finalTxData.denom) {
        const { amount, denom } = finalTxData;
        const isHash = finalTxData.denom === 'nhash';
        finalTxData.amount = {
          amount: isHash ? hashFormat(amount as string) : (amount as string),
          denom: isHash ? 'Hash' : denom,
        };
        delete finalTxData.denom;
      }
      finalTxData.platform = connector?.peerMeta?.name || 'N/A';
      const formattedTx = txMessageFormat(finalTxData);
      return <List message={formattedTx} maxHeight="270px" type="txcomplete" />;
    }
    return <Typo type="error">Unable to show transaction result details</Typo>;
  };

  return (
    <Content>
      <SuccessIcon src={checkSuccessIcon} />
      <Typo type="title" align="center" marginTop="20px">
        Transaction Complete
      </Typo>
      <Typo type="displayBody" align="center" marginTop="14px" marginBottom="20px">
        Your transaction details are below
      </Typo>
      <FullData data={{ txRaw: JSON.stringify(result) }} />
      {renderTxData()}
      <BottomFloat>
        <Button onClick={closeWindow}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
