import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from 'Components';

const Wrapper = styled.div`
  width: 100%;
  text-align: center;
  font-family: 'Gothic A1', sans-serif;
`;
const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HeaderTitle = styled.div`
  font-size: 1.4rem;
  text-transform: uppercase;
  font-weight: 700;
`
const HeaderIcon = styled.img`
  width:30px;
  margin-bottom: 10px;
`;
const Price = styled.div`
  font-size: 6.4rem;
  font-weight: 300;
  font-family: 'Montserrat', sans-serif;
`;


export const Asset:React.FC = () => {
  const { assetName } = useParams();

  return (
    assetName ? 
    <Wrapper>
      <Header
        title={
          <HeaderTitleGroup>
            <HeaderIcon src={`/images/assets/${assetName}.svg`} alt={`${assetName} icon`} />
            <HeaderTitle>{assetName}</HeaderTitle>
          </HeaderTitleGroup>
        }
      />
      <Price>$0.118</Price>
      <div>^ $0.008(0.10%)</div>
      <div>[CHART]</div>
      <div>Statistics</div>
      <div>Day Volume</div>
      <div>332,850</div>
      <div>Statistic</div>
      <div>X</div>
      <div>Day High</div>
      <div>$0.118</div>
      <div>Day Low</div>
      <div>$0.101</div>
      <div>Recent Transactions</div>
    </Wrapper>
    : null
  );
};
