import { BodyContent, CtaButton, Header, Input } from 'Components';
import { ICON_NAMES } from 'consts';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  padding: 42px 16px;
`;

interface Props {
  nextUrl: string;
}

export const CreateStart = ({ nextUrl }: Props) => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Header iconLeft={ICON_NAMES.CLOSE} progress={33} title="Name You Account" />
      <BodyContent
        $css={css`
          text-align: center;
          margin-bottom: 32px;
        `}
      >
        Name your acount to easily identify it while using the Figure Tech Wallet. These names are
        stored locally, and can only be seen by you.
      </BodyContent>

      <Input id="account-name" label="Account Name" type="text" placeholder="Account Name" />

      <CtaButton onClick={() => navigate(nextUrl)}>Continue</CtaButton>
    </Wrapper>
  );
};
