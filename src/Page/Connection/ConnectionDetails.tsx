import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Message } from '../Confirm';
import { COLORS } from 'theme';

const Section = styled.div`
  border-bottom: 1px solid ${COLORS.NEUTRAL_600};
  font-family: 'Gothic A1', sans-serif;
  padding: 15px 10px;
  font-weight: 400;
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  font-size: 1.2rem;
  :last-child {
    border-bottom: none;
  }
`;
const SectionAction = styled.div`
  line-height: 130%;
  font-weight: 400;
  font-size: 14px;
`;
const SectionDate = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 160%;
  margin-top: 5px;
`;

const Action = styled.span`
  display: flex;
  align-items: center;
  align-self: center;
  padding: 1px 0 0 9px;
  width: 110px;
  height: 23px;
  background: ${COLORS.SECONDARY_650};
  color: ${COLORS.SECONDARY_350};
  border-radius: 46px;
  font-family: 'Gothic A1', sans-serif;
  font-size: 12px;
  font-weight: 400px;
`;

interface MsgProps {
  [key: string]: string;
}

export const ConnectionDetails = () => {
  const navigate = useNavigate();

  // TO DO: This should come from somewhere
  const message = {
    platform: 'dLOB',
    url: 'thisisafakeurl.com'
  };

  const data = [
    {
      action: "Send Hash",
      date: "Nov 11, 2021"
    },
    {
      action: "Sign Message",
      date: "Nov 11, 2021"
    },
    {
      action: "Add Marker",
      date: "Nov 11, 2021"
    },
  ]

  // TO DO: This should handle disconnecting
  const handleDisconnect = () => navigate('/dashboard');

  const createAction = (data: MsgProps[]) => {
    const myElement = data.map((item: MsgProps) => {
      return (
        <Section key={item.action}>
          <div>
          <SectionAction>{item.action}</SectionAction>
          <SectionDate>{item.date}</SectionDate>
          </div>
          <Action>Action Required</Action>
        </Section>
      )
    })
    return myElement;
  }

  return (
    <Message
      headerTitle='Connection Details'
      message={message}
      cancelButton={false}
      buttonTitle='Disconnect'
      onClick={handleDisconnect}
      addItems={createAction(data)}
    />
  )
}