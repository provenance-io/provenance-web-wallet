import styled from 'styled-components';
import { Typo } from 'Components';

const Container = styled.div`
  background: #2c2f3a;
  padding: 16px;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  text-align: left;
`;
const StatsItem = styled.div`
  flex-basis: 50%;
  &:first-child {
    margin-bottom: 30px;
  }
`;
const StatTitle = styled.div`
  margin-bottom: 10px;
  color: #b9bdca;
  font-size: 1.2rem;
  font-family: 'Gothic A1', sans-serif;
`;
const StatValue = styled.div`
  font-size: 1.4rem;
`;

export const AssetStats: React.FC = () => {
  return (
    <>
      <Typo type="title" marginTop="30px" marginBottom="10px" align="left">
        Statistics
      </Typo>
      <Container>
        <StatsItem>
          <StatTitle>Day Volume</StatTitle>
          <StatValue>332,850</StatValue>
        </StatsItem>
        <StatsItem>
          <StatTitle>Statistics</StatTitle>
          <StatValue>X</StatValue>
        </StatsItem>
        <StatsItem>
          <StatTitle>Day High</StatTitle>
          <StatValue>$0.118</StatValue>
        </StatsItem>
        <StatsItem>
          <StatTitle>Day Low</StatTitle>
          <StatValue>$0.101</StatValue>
        </StatsItem>
      </Container>
    </>
  );
};
