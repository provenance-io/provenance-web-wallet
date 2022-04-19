import { CtaButton, Header } from 'Components';
import { useNavigate } from 'react-router-dom';

interface Props {
  nextUrl: string;
}

export const CreateComplete = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <Header progress={100} title="Wallet Created" iconLeft='none' />
      <div>Wallet has been successfully created.  Click continue to proceed to the dashboard.</div>
      <CtaButton onClick={() => navigate(nextUrl)}>Continue</CtaButton>
    </>
  );
};
