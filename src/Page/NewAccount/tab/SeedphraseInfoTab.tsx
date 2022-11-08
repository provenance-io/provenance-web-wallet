import { useNavigate } from 'react-router-dom';
import { Button, ImageContainer, FullPage, Typo } from 'Components';
import passphraseImg from 'images/passphrase-intro.png';
import recoverImg from 'images/recover-intro.svg';
import type { FlowType } from 'types';

interface Props {
  nextUrl: string;
  flowType: FlowType;
}

export const SeedphraseInfoTab = ({ nextUrl, flowType }: Props) => {
  const navigate = useNavigate();
  const isRecoveryFlow = flowType === 'recover';
  const isImportFlow = flowType === 'import';
  const willEnterSeedPhrase = isRecoveryFlow || isImportFlow;
  const imageSrc = willEnterSeedPhrase ? recoverImg : passphraseImg;

  const handleContinue = () => {
    // Change the hash for the nextUrl
    window.location.hash = `#${nextUrl}`;
    navigate(nextUrl);
  };

  return (
    <FullPage title="Recovery Seed Phrase">
      <Typo type="body" align="left" marginBottom="12px">
        Prepare to write down your recovery seed phrase. This is the only way to
        recover a lost account, or move the account to a new wallet.
      </Typo>
      <ImageContainer
        size="140px"
        centered
        src={imageSrc}
        alt="Secure your account"
      />
      <Typo type="error" align="left" marginTop="12px" marginBottom="60px">
        Do not share this seed phrase with anyone, it grants full access to your
        account.
      </Typo>
      <Button onClick={handleContinue}>Continue</Button>
    </FullPage>
  );
};
