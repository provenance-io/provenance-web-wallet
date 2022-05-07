import { EventPayload } from 'types';
import styled from 'styled-components';
import { Authenticate } from './Authenticate';
import { useWalletConnect } from 'redux/hooks';
import { List } from 'Components';
// import { signBytes } from 'utils';

const Title = styled.div`
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.32em;
  line-height: 20px;
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 20px;
`;
const SubTitle = styled.div`
  font-weight: 400;
  font-family: "Gothic A1", sans-serif;
  letter-spacing: 0.04em;
  line-height: 160%;
  text-align: center;
  font-size: 1.6rem;
  margin: 32px;
`;

interface Props {
  data: EventPayload
}

export const SignRequest:React.FC<Props> = ({ data }) => {
  const { connector } = useWalletConnect();  
    
  const closeWindow = async () => {
    const currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.id) {
      chrome.windows.remove(currentWindow.id);
    } else {
      window.close();
    }
  };

  const handleApprove = async () => {
    if (connector) {
      // const result = signBytes(bites, privateKey);
      // connector.approveRequest({
      //   id, jsonrpc, result: 'success',
      // })
      // await connector.approveSession(data as any);
      // Close the popup
      closeWindow();
    }
  }
  const handleDecline = async () => {
    if (connector) {
      await connector.rejectSession({ message: 'Sign request rejected by user' });
      // Close the popup
      closeWindow();
    }
  }
  
  const ListItems = {
    platform: 'Figure Equity Solutions',
    address: 'address',
    created: 'created',
    messageType: 'messageType',
    'Est. Gas Fee': '0.00 Hash',
  };

  return (
    <>
      <Title>Sign Request</Title>
      <List message={ListItems} />
      <Authenticate handleApprove={handleApprove} handleDecline={handleDecline} />
    </>
  );
};
