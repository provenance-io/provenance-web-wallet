import { useNavigate } from 'react-router-dom';
import { Message } from '../Confirm';

export const TransactionComplete = () => {
  const navigate = useNavigate();

  const handleApprove = () => {
    // TO DO: Add any messages needing to be sent to chain for approval
    navigate('/dashboard');
  }

  return (
    <Message
      title='transaction complete'
      message={{note: 'Congrats, your money is on its way!'}}
      onClick={handleApprove}
      buttonTitle='Back to Wallet'
      cancelButton={false}
      // color={COLORS.POSITIVE_400}
    />
  );
};