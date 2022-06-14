import { Success } from 'Components';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'redux/hooks';

interface Props {
  nextUrl: string;
}

export const CreateComplete = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const { clearTempAccount } = useAccount();
  const finishCreation = () => {
    // Remove temp data
    clearTempAccount();
    // Go to /dashboard
    navigate(nextUrl);
  };
  return (
    <Success 
      title='wallet created' 
      subTitle='Wallet has been successfully created. Click continue to proceed to the dashboard' 
      onClick={finishCreation}
    />
  );
};
