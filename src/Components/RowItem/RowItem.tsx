import { Sprite } from 'Components/Sprite';
import { Typo } from 'Components/Typography/Typo';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { COLORS } from 'theme';
import { keyPress } from 'utils';

const AssetItem = styled.div<{
  onClick?: (e: React.KeyboardEvent | React.MouseEvent) => void;
}>`
  padding: 20px 16px;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid ${COLORS.NEUTRAL_600};
  display: flex;
  align-items: center;
  font-family: 'Gothic A1';
  &&:first-of-type {
    border-top: 1px solid ${COLORS.NEUTRAL_600};
  }
  cursor: ${({ onClick }) => (!!onClick ? 'pointer' : 'initial')};
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
  onClick?: (e: React.KeyboardEvent | React.MouseEvent) => void;
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
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (!!onClick) onClick(e);
  };

  return (
    <AssetItem
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => keyPress(e, 'Enter', () => handleClick(e))}
    >
      {!!img && <AssetImg src={`/images/assets/${img}.svg`} />}
      <AssetDetails>
        <DetailsGroup>
          <Typo type="body" bold align="left">
            {title}
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
      {!!actionIcon && (
        <AssetArrow>
          <Sprite icon={actionIcon} size="1.2rem" />
        </AssetArrow>
      )}
    </AssetItem>
  );
};
