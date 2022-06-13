import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Sprite as BaseSprite, Button } from 'Components';
import { COLORS } from 'theme';
import { 
  ICON_NAMES,
  DASHBOARD_URL,
 } from 'consts';
import bg from 'images/bg.png';

const Div = styled.div<{ height: string }>`
  background: ${COLORS.BACKGROUND_1} url(${bg}) no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  min-height: ${({ height }) => height ? height : '628px'};
  min-width: 375px;
  justify-content: center;
  text-align: center;
  align-content: center;
  overflow: hidden;
  padding: 0;
  margin: 0;
`;

const Content = styled.div`
  margin-top: 150px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
`;

const Circle = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  background: linear-gradient(134.17deg, ${COLORS.NEUTRAL_800} 4.98%, ${COLORS.NEUTRAL_700} 94.88%);
  box-shadow: 0px 1.26667px 1.26667px rgba(0, 0, 0, 0.25);
  border: 1px solid ${COLORS.POSITIVE_350};
  align-self: center;
`;

const Title = styled.div`
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.32em;
  line-height: 20px;
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
`;

const SubTitle = styled(Title)`
  font-weight: 400;
  font-family: 'Gothic A1', sans-serif;
  letter-spacing: 0.04em;
  font-size: 14px;
  line-height: 160%;
`;

const Sprite = styled(BaseSprite)`
  align-self: center;
`;

interface SuccessProps {
  title: string;
  subTitle?: string;
  onClick?: () => void;
  goTo?: string;
  height?: string;
}

export const Success = ({
  title,
  subTitle = '',
  onClick,
  goTo = DASHBOARD_URL,
  height = '',
}: SuccessProps) => {
  const navigate = useNavigate();
  console.log("Totally running this");

  return (
    <Div height={height}>
      <Content>
        <Title>{title.toUpperCase()}</Title>
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
        <Circle>
          <Sprite icon={ICON_NAMES.CHECK} color={COLORS.POSITIVE_250} size='4rem'/>
        </Circle>
      </Content>
      <Button onClick={onClick ? onClick : () => navigate(goTo)}>Continue</Button>
    </Div>
  );
};