import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  BodyContent,
  Button,
  Header,
  Content,
} from 'Components';
import { COLORS } from 'theme';
import { useAccount } from 'redux/hooks';

const MnuemonicList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  padding: 20px 30px;
  height: 580px;
  border-radius: 4px;
  font-size: 1.4rem;
  background: ${COLORS.NEUTRAL_700};
`;
const ListItemNumber = styled.p`
  color: ${COLORS.NEUTRAL_250};
  display: inline-block;
  width: 1.4em;
  margin-right: 0.5em;
  text-align: left;
`;
const MnuemonicItem = styled.p`
  display: flex;
  justify-content: flex-start;
`;

interface Props {
  nextUrl: string;
}

export const Seedphrase = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  const { tempWallet } = useAccount();
  const mnemonic = tempWallet?.mnemonic || '';
  const handleContinue = () => {
    navigate(nextUrl);
  };

  return (
    <Content>
      <Header progress={66} title="Recovery Passphrase" />
      <BodyContent
        $css={css`
          margin-top: 8px 0 24px 0;
          text-align: center;
        `}
      >
        Make sure to record these words in the correct order, using the corresponding
        numbers.
      </BodyContent>
      <MnuemonicList>
        {mnemonic?.split(' ').map((word, index) => (
          <MnuemonicItem key={index}>
            <ListItemNumber as="span">{index + 1}</ListItemNumber> {word}
          </MnuemonicItem>
        ))}
      </MnuemonicList>
      <Button onClick={handleContinue} >Continue</Button>
    </Content>
  );
};
