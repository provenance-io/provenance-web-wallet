import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { generateMnemonic } from 'redux/features/app/appSlice';
import { BodyContent, CtaButton, Header } from 'Components';
import { COLORS } from 'theme';
import { useEffect } from 'react';

const MnuemonicList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 12px 8px;
  height: 428px;
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

export const Passphrase = ({ nextUrl }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const mnemonic = useAppSelector((state) => state.app.mnemonic)?.split(' ');

  useEffect(() => {
    // if the mnemonic doesn't exist we need to generate it
    if (!mnemonic) {
      dispatch(generateMnemonic());
    }
  }, [mnemonic, dispatch]);

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
        Make sure to record these words in the correct order, using the corresponding numbers.
      </BodyContent>

      <MnuemonicList>
        {mnemonic?.map((w, i) => (
          <BodyContent key={i}>
            <ListItemNumber as="span">{i + 1}</ListItemNumber> {w}
          </BodyContent>
        ))}
      </MnuemonicList>

      <CtaButton onClick={() => navigate(nextUrl)}>Continue</CtaButton>
    </>
  );
};
