import { CtaButton, Header } from 'Components';
import { useNavigate } from 'react-router-dom';
import { useWallet } from 'redux/hooks';

interface Props {
  nextUrl: string;
}

export const CreateComplete = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const { clearTempWallet } = useWallet();
  const finishCreation = () => {
    // Remove temp data
    clearTempWallet();
    // Go to /dashboard
    navigate(nextUrl);
  };
  return (
    <>
      <Header progress={100} title="Wallet Created" iconLeft='none' />
      <div>Wallet has been successfully created.  Click continue to proceed to the dashboard.</div>
      <CtaButton onClick={finishCreation}>Continue</CtaButton>
    </>
  );
};
