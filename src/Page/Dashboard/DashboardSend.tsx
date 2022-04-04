import { Header } from 'Components';
import styled from 'styled-components';
import { ICON_NAMES } from 'consts';

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
`;
const SectionTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  text-align: left;
  margin-bottom: 10px;
`;

export const DashboardSend:React.FC = () => {
  return (
    <Wrapper>
      <Header title="Send" iconLeft={ICON_NAMES.CLOSE} />
      <SectionTitle>Select Asset</SectionTitle>
      <SectionTitle>Send to Address</SectionTitle>
      <SectionTitle>Recent Addresses</SectionTitle>
    </Wrapper>
  )
};
