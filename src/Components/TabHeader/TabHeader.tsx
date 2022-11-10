import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { COLORS } from 'theme';
import { Sprite } from '../Sprite/Sprite';
import { Typo } from '../Typo/Typo';

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const Logo = styled.div`
  background: white;
  padding: 6px 3px 6px 9px;
  border-radius: 8px;
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  title?: string;
}

export const TabHeader: React.FC<Props> = ({ title }) => {
  return (
    <Container>
      <Header>
        <Logo>
          <Sprite
            icon={ICON_NAMES.PROVENANCE}
            size="2rem"
            color={COLORS.PRIMARY_500}
          />
        </Logo>
        <Typo type="subhead">Provenance Blockchain Wallet Extension</Typo>
      </Header>
      {title && <Typo type="title">{title}</Typo>}
    </Container>
  );
};
