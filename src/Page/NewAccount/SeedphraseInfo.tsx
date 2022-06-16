import { useNavigate } from 'react-router-dom';
import {
  Button,
  Header,
  ImageContainer,
  Content,
  Typo,
} from 'Components';
import passphraseImg from 'images/passphrase-intro.png';
import recoverImg from 'images/recover-intro.svg';

interface Props {
  nextUrl: string;
  previousUrl: string;
  flowType: 'create' | 'add' | 'recover';
}

export const SeedphraseInfo = ({ previousUrl, nextUrl, flowType }: Props) => {
  const navigate = useNavigate();
  const isRecovery = flowType === 'recover';
  const imageSrc = isRecovery ? recoverImg : passphraseImg;
  const headerTitle = isRecovery ? 'Recover Account' : 'Recovery Seed Phrase';
  const pageTitle = isRecovery ? 'Recover Account' : 'Save Seed Phrase';
  const pageBody = isRecovery ?
    "In the following steps, you'll enter your 24-word recovery passphrase to access your account" :
    'Prepare to write down your recovery seed phrase. This is the only way to recover a lost account.';
  const warning = isRecovery ? '' :  'Do not share this passphrase with anyone, as it grants full access to your account.';

  return (
    <Content>
      <Header progress={66} title={headerTitle} backLocation={previousUrl} />
      <Typo type="headline2">{pageTitle}</Typo>
      <Typo type="body">{pageBody}</Typo>
      <ImageContainer size="140px" centered src={imageSrc} alt="Secure your account" />
      {!!warning && <Typo type="error">{warning}</Typo>}
      <Button onClick={() => navigate(nextUrl)}>Continue</Button>
    </Content>
  );
};
