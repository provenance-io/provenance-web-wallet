import { Sprite } from 'Components';
import { ICON_NAMES } from 'consts';
import styled from 'styled-components';
import { COLORS } from 'theme';

type AlertTypes = 'success' | 'error' | 'warning' | 'info';

interface StyledProps {
  type: AlertTypes
}

const typeStyling = {
  success: {
    text: COLORS.POSITIVE_150,
    bg: COLORS.POSITIVE_600,
    icon: ICON_NAMES.CHECK,
  },
  error: {
    text: COLORS.NEGATIVE_150,
    bg: COLORS.NEGATIVE_600,
    icon: ICON_NAMES.INFO,
  },
  warning: {
    text: COLORS.NOTICE_150,
    bg: COLORS.NOTICE_600,
    icon: ICON_NAMES.WARNING,
  },
  info: {
    text: COLORS.PRIMARY_300,
    bg: COLORS.PRIMARY_550,
    icon: ICON_NAMES.INFO,
  }
};

const AlertContainer = styled.div<StyledProps>`
  padding: 8px 14px 14px 14px;
  width: 100%;
  background: ${({ type }) => typeStyling[type].bg };
  border-radius: 5px;
  display: flex;
`;
const AlertIcon = styled.div`
  margin-right: 10px;
  height: 2rem;
  width: 2rem;
`;
const AlertContent = styled.div<StyledProps>`
  color: ${({ type }) => typeStyling[type].text };
  text-align: left;
  margin-top: 3px;
`;
const AlertTitle = styled.div`
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 6px;
`;
const AlertCopy = styled.div`
  font-size: 12px;
`;

interface Props {
  className?: string,
  type?: AlertTypes,
  children: React.ReactNode,
  title?: string,
}

export const Alert:React.FC<Props> = ({ className, type = 'info', children, title }) => {
  return (
    <AlertContainer className={className} type={type}>
      <AlertIcon>
        <Sprite icon={typeStyling[type].icon} color={typeStyling[type].text} size="2rem" />
      </AlertIcon>
      <AlertContent type={type}>
        {!!title && <AlertTitle>{title}</AlertTitle>}
        <AlertCopy>{children}</AlertCopy>
      </AlertContent>
    </AlertContainer>
  )
};
