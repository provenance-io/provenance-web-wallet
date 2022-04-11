import styled from 'styled-components';

const SectionTitle = styled.div`
  font-size: 1.9rem;
  font-weight: 700;
  margin: 30px 0 10px 0;
  text-align: left;
`;
const Container = styled.div`
  background: #2C2F3A;
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
  color: #B9BDCA;
  font-size: 1.2rem;
  font-family: 'Gothic A1', sans-serif;
`;
const StatValue = styled.div`
  font-size: 1.4rem;
`;

export const AssetStats:React.FC = () => {
  return (
    <>
      <SectionTitle>Statistics</SectionTitle>
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
