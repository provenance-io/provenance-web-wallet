import { useNavigate } from 'react-router-dom';
import { Button, ImageContainer, FullPage, Typo } from 'Components';
import passphraseImg from 'images/passphrase-intro.png';
import recoverImg from 'images/recover-intro.svg';
import type { FlowType } from 'types';

interface Props {
  nextUrl: string;
  flowType: FlowType;
}

export const SeedphraseInfo = ({ nextUrl, flowType }: Props) => {
  const navigate = useNavigate();
  const isRecoveryFlow = flowType === 'recover';
  const isImportFlow = flowType === 'import';
  const willEnterSeedPhrase = isRecoveryFlow || isImportFlow;
  const imageSrc = willEnterSeedPhrase ? recoverImg : passphraseImg;
  const headerTitle = isRecoveryFlow
    ? 'Recover Account'
    : isImportFlow
    ? 'Import Account'
    : 'Recovery Seed Phrase';
  const pageBody = willEnterSeedPhrase
    ? "In the following steps, you'll enter your 24-word recovery passphrase to access your account"
    : 'Prepare to write down your recovery seed phrase. This is the only way to recover a lost account.';
  const warning = willEnterSeedPhrase
    ? ''
    : 'Do not share this passphrase with anyone, as it grants full access to your account.';

  const handleContinue = () => {
    // Change the hash for the nextUrl
    window.location.hash = `#${nextUrl}`;
    navigate(nextUrl);
  };

  return (
    <FullPage title={headerTitle}>
      <Typo type="body" align="left" marginBottom="12px">
        {pageBody}
      </Typo>
      <ImageContainer
        size="140px"
        centered
        src={imageSrc}
        alt="Secure your account"
      />
      {!!warning && (
        <Typo type="error" align="left" marginTop="12px" marginBottom="60px">
          {warning}
        </Typo>
      )}
      <Button onClick={handleContinue}>Continue</Button>
    </FullPage>
  );
};
