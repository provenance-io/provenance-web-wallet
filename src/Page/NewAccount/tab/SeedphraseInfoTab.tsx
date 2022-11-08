import { useNavigate } from 'react-router-dom';
import {
  Button,
  Header,
  ImageContainer,
  FullPage,
  Typo,
  BottomFloat,
} from 'Components';
import passphraseImg from 'images/passphrase-intro.png';
import recoverImg from 'images/recover-intro.svg';
import type { FlowType } from 'types';

interface Props {
  nextUrl: string;
  previousUrl: string;
  flowType: FlowType;
  progress: number;
}

export const SeedphraseInfoTab = ({
  previousUrl,
  nextUrl,
  flowType,
  progress,
}: Props) => {
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
  const pageTitle = isRecoveryFlow
    ? 'Recover Account'
    : isImportFlow
    ? 'Import Account'
    : 'Save Seed Phrase';
  const pageBody = willEnterSeedPhrase
    ? "In the following steps, you'll enter your 24-word recovery passphrase to access your account"
    : 'Prepare to write down your recovery seed phrase. This is the only way to recover a lost account.';
  const warning = willEnterSeedPhrase
    ? ''
    : 'Do not share this passphrase with anyone, as it grants full access to your account.';

  return (
    <FullPage>
      <Header progress={progress} title={headerTitle} backLocation={previousUrl} />
      <Typo type="headline2">{pageTitle}</Typo>
      <Typo type="body" marginTop="30px" marginBottom="60px">
        {pageBody}
      </Typo>
      <ImageContainer
        size="140px"
        centered
        src={imageSrc}
        alt="Secure your account"
      />
      {!!warning && <Typo type="error">{warning}</Typo>}
      <BottomFloat>
        <Button onClick={() => navigate(nextUrl)}>Continue</Button>
      </BottomFloat>
    </FullPage>
  );
};
