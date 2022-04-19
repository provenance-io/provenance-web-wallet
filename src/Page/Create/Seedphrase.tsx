import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BodyContent, CtaButton, Header } from 'Components';
import { COLORS } from 'theme';
import { createMnemonic } from 'utils';
import { useWallet } from 'redux/hooks';

const MnuemonicList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 12px 8px;
  height: 428px;
  width: 100%;
  padding: 16px 32px;
  border-radius: 4px;
  background: ${COLORS.NEUTRAL_700};
`;

const ListItemNumber = styled(BodyContent)`
  color: ${COLORS.NEUTRAL_250};
  display: inline-block;
  width: 2em;
  margin-right: 0.5em;
  text-align: right;
  direction: rtl;
`;

interface Props {
  nextUrl: string;
}

export const Seedphrase = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const mnemonic = createMnemonic();
  const { activeWalletIndex, updateWallet } = useWallet();

  const handleContinue = () => {
    if (mnemonic) {
      // Save this mnuemonic into current wallet
      updateWallet({ walletIndex: activeWalletIndex, mnemonic });
      navigate(nextUrl);
    }
  };

  return (
    <>
      <Header progress={66} title="Recovery Passphrase" />

      <BodyContent
        $css={css`
          margin-bottom: 24px;
          padding-top: 8px;
          text-align: center;
        `}
      >
        Make sure to record these words in the correct order, using the corresponding
        numbers.
      </BodyContent>

      <MnuemonicList>
        {mnemonic?.split(' ').map((w, i) => (
          <BodyContent key={i}>
            <ListItemNumber as="span">{i + 1}</ListItemNumber> {w}
          </BodyContent>
        ))}
      </MnuemonicList>

      <CtaButton onClick={handleContinue}>Continue</CtaButton>
    </>
  );
};
