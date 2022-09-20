import { Typo, List, Content, BottomFloat, Button, FullData } from 'Components';
import styled from 'styled-components';
import { txMessageFormat } from 'utils';
import checkSuccessIcon from 'images/check-success.svg';
import checkWarningIcon from 'images/check-warning.svg';
import { useWalletConnect } from 'redux/hooks';
import type { TxResults } from 'types';

interface Props {
  pageData: {
    result?: TxResults;
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
  // If code exists and it isn't 0, then we have an error
  const isSuccess = !!result && !result?.code;
  const renderTxData = () => {
    if (result) {
      // Clone targetTx to make changes if needed
      const finalTxData = { ...result };
      finalTxData.platform = connector?.peerMeta?.name || 'N/A';
      const formattedTx = txMessageFormat(finalTxData);
      return (
        <List
          message={formattedTx}
          maxHeight="270px"
          type="txcomplete"
          showRawLog={!isSuccess}
        />
      );
    }
    return <Typo type="error">Unable to show transaction result details</Typo>;
  };

  return (
    <Content>
      <SuccessIcon src={isSuccess ? checkSuccessIcon : checkWarningIcon} />
      <Typo type="title" align="center" marginTop="20px">
        {isSuccess ? 'Transaction Complete' : 'Transaction Failed'}
      </Typo>
      <Typo type="displayBody" align="center" marginTop="14px" marginBottom="20px">
        {isSuccess
          ? 'Your transaction details are below'
          : 'Your transaction has failed, review the details below'}
      </Typo>
      <FullData data={{ txRaw: JSON.stringify(result) }} />
      {renderTxData()}
      <BottomFloat>
        <Button onClick={closeWindow}>Close</Button>
      </BottomFloat>
    </Content>
  );
};
