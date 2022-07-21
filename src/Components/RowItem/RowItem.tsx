import { Sprite } from 'Components/Sprite';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
// import { currencyFormat } from 'utils';

const AssetItem = styled.div`
  padding: 20px 16px;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid #3D4151;
  display: flex;
  align-items: center;
  font-family: 'Gothic A1';
  cursor: pointer;
  &:first-of-type {
    border-top: 1px solid #3D4151;
  }
`;
const AssetImg = styled.img`
  margin-right: 16px;
  width: 40px;
`;
const AssetDetails = styled.div`
  line-height: 20px;
`;
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
const AssetArrow = styled.div`
  flex-grow: 1;
  text-align: right;
`;

interface Props {
  img: string,
  title: string,
  onClick?: () => void,
  actionIcon?: string,
  subtitle?: string,
}

export const RowItem:React.FC<Props> = ({
  img,
  title,
  subtitle,
  onClick,
  actionIcon=`${ICON_NAMES.CHEVRON}`,
}) => {

  return (
    <AssetItem onClick={onClick}>
      <AssetImg src={`/images/assets/${img}.svg`} />
      <AssetDetails>
        <AssetName>{title}</AssetName>
        <AssetAmount>{subtitle}</AssetAmount>
      </AssetDetails>
      <AssetArrow>
        <Sprite icon={actionIcon} size="1.2rem" />
      </AssetArrow>
    </AssetItem>
  );
};
