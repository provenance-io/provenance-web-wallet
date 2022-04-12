import { useNavigate } from 'react-router-dom';
import { COLORS } from 'theme';
import { Connect } from '../Confirm';

export const TransactionComplete = () => {
  const navigate = useNavigate();

  const handleApprove = () => {
    // TO DO: Add any messages needing to be sent to chain for approval
    navigate('/dashboard');
  }

  return (
    <Connect
      title='transaction complete'
      info='Congrats, your money is on its way!'
      onClick={handleApprove}
      buttonTitle='Back to Wallet'
      cancelButton={false}
      color={COLORS.POSITIVE_400}
    />
  );
};