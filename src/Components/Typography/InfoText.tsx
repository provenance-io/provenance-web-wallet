import styled from 'styled-components';

interface StyleProps {
  size: string,
  margin: string,
  maxWidth: string,
  font: 'PRIMARY' | 'SECONDARY',
}

const InfoTextStyled = styled.h1<StyleProps>`
  font-size: ${({ size }) => size};
  max-width: ${({ maxWidth }) => maxWidth};
  line-height: 2.2rem;
  margin: ${({ margin }) => margin};
  font-weight: 400;
  font-family: ${({ font }) => font === 'PRIMARY' ? "'Gothic A1', sans-serif" : "'Montserrat', sans-serif" };
`;

interface Props {
  size?: string,
  className?: string,
  margin?: string,
  maxWidth?: string,
  font?: 'PRIMARY' | 'SECONDARY',
}

export const InfoText:React.FC<Props> = ({
  size = '1.4rem',
  margin = '64px auto 0',
  maxWidth = '300px',
  font = 'SECONDARY',
  className,
  children,
}) => (
  <InfoTextStyled
    size={size}
    className={className}
    margin={margin}
    maxWidth={maxWidth}
    font={font}
  >
    {children}
  </InfoTextStyled>
);