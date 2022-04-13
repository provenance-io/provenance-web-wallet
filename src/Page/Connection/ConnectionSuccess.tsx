import { useNavigate } from 'react-router-dom';
import { Connect } from '../Confirm';
import { COLORS } from 'theme';

export const ConnectionSuccess = () => {
  const navigate = useNavigate();
  // TO DO: Get this from somewhere
  const connection = 'dLOB';
  const handleClick = () => navigate('/dashboard');
  return (
    <Connect
      title='connection successful'
      info={`You're now connected to ${connection}`}
      onClick={handleClick}
      buttonTitle='Done'
      cancelButton={false}
      color={COLORS.POSITIVE_400}
    />
  )
}