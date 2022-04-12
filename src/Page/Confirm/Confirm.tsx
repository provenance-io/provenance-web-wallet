import { useNavigate } from 'react-router-dom';
import { Message, Connect } from '.';

export const Confirm = () => {
  const navigate = useNavigate();

  // TO DO: Replace this with actual messages
  const message = {
    platform: 'Figure Equity Solutions',
    address: 'yoaddresshomie',
    created: '2022/04/11',
    type: 'Fake News',
    fees: '300 hash',
    to: 'yomomma',
    denom: 'hash',
    amount: '100.0101',
  }

  const handleApprove = () => {
    // TO DO: Add additional functionality
    navigate('/transactions');
  }

  //return (
  //  <Message message={message} onClick={handleApprove} />
  //)

  // TO DO: Currently "Confirm" is designed to house
  // connection requests (/connect) and message confirmation (/confirm).
  // Need to ensure we are sending the user to the correct url
  // for rendering purposes.

  return (
    <Connect 
      requestor={"Figure Equity Solutions"}
      onClick={handleApprove}
    />
  );
};
