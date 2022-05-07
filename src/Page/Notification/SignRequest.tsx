import { EventPayload } from 'types';
import styled from 'styled-components';
import { Authenticate } from './Authenticate';
import { useWalletConnect } from 'redux/hooks';
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
const DisplayTitle = styled.div`
  font-family: "Courier New", Courier, monospace;
  color: white;
  font-weight: bold;
  background: rgba(255,255,255,0.5);
  box-shadow: 0px 0px 9px 0px rgb(255 255 255 / 70%) inset;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 1.6rem;
  margin: 30px;
  white-space: nowrap;
  overflow: scroll;
  overflow-y: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
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
  
  return (
    <>
      <Title>Sign Request</Title>
      <DisplayTitle>You have a new signing request</DisplayTitle>
      <SubTitle>
        Sign message: "test_123"
      </SubTitle>
      <Authenticate handleApprove={handleApprove} handleDecline={handleDecline} />
    </>
  );
};
