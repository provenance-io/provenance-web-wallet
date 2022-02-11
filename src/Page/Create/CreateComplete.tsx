import { CtaButton, Header } from 'Components';
import { useNavigate } from 'react-router-dom';

interface Props {
  nextUrl: string;
}

export const CreateComplete = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <Header progress={100} title="Backup Complete" />

      <CtaButton onClick={() => navigate(nextUrl)}>Continue</CtaButton>
    </>
  );
};
