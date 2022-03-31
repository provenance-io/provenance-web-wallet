import styled from 'styled-components';

const AssetItem = styled.div`
  padding: 20px 16px;
  width: 100%;
  border-bottom: 1px solid #3D4151;
  display: flex;
  align-items: center;
  font-family: 'Gothic A1';
  cursor: pointer;
`;
const AssetImg = styled.img`
  margin-right: 16px;
`;
const AssetDetails = styled.div``;
const AssetName = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  text-transform: uppercase;
`;
const AssetAmount = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
  color: #B9BDCA;
`;

interface Props {
  img: string,
  name: string,
  amount: number,
}

export const Asset:React.FC<Props> = ({ img, name, amount }) => {
  return (
    <AssetItem>
      <AssetImg src={`/images/assets/${img}.svg`} />
      <AssetDetails>
        <AssetName>{name}</AssetName>
        <AssetAmount>{amount}</AssetAmount>
      </AssetDetails>
    </AssetItem>
  );
};
