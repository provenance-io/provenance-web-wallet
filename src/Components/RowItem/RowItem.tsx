import { Sprite } from 'Components/Sprite';
import { Typo } from 'Components/Typography/Typo';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { capitalize } from 'utils';
// import { currencyFormat } from 'utils';

const AssetItem = styled.div`
  padding: 20px 16px;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid #3d4151;
  display: flex;
  align-items: center;
  font-family: 'Gothic A1';
  cursor: pointer;
  &:first-of-type {
    border-top: 1px solid #3d4151;
  }
`;
const AssetImg = styled.img`
  margin-right: 16px;
  width: 40px;
`;
const AssetDetails = styled.div`
  width: 100%;
  line-height: 20px;
  display: flex;
  justify-content: space-between;
`;
const DetailsGroup = styled.div`
  flex-grow: 1;
  margin-right: 16px;
`;
const AssetArrow = styled.div`
  flex-grow: 1;
  text-align: right;
`;

interface Props {
  actionIcon?: string;
  detailsBottom?: string;
  detailsTop?: string;
  img?: string;
  onClick?: () => void;
  subtitle?: string;
  title: string;
}

export const RowItem: React.FC<Props> = ({
  actionIcon = `${ICON_NAMES.CHEVRON}`,
  detailsBottom,
  detailsTop,
  img,
  onClick,
  subtitle,
  title,
}) => {
  return (
    <AssetItem onClick={onClick}>
      {!!img && <AssetImg src={`/images/assets/${img}.svg`} />}
      <AssetDetails>
        <DetailsGroup>
          <Typo type="body" bold align="left">
            {capitalize(title, 'uppercase')}
          </Typo>
          <Typo type="footnote" align="left">
            {subtitle}
          </Typo>
        </DetailsGroup>
        {(detailsTop || detailsBottom) && (
          <DetailsGroup>
            {detailsTop && (
              <Typo type="footnote" align="right">
                {detailsTop}
              </Typo>
            )}
            {detailsBottom && (
              <Typo type="footnote" align="right">
                {detailsBottom}
              </Typo>
            )}
          </DetailsGroup>
        )}
      </AssetDetails>
      <AssetArrow>
        <Sprite icon={actionIcon} size="1.2rem" />
      </AssetArrow>
    </AssetItem>
  );
};
