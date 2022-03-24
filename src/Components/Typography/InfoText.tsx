import styled from 'styled-components';

interface StyleProps {
  size: string,
  margin: string,
  maxWidth: string,
}

const InfoTextStyled = styled.h1<StyleProps>`
  font-size: ${({ size }) => size};
  max-width: ${({ maxWidth }) => maxWidth};
  line-height: 2.2rem;
  margin: ${({ margin }) => margin};
  font-weight: 400;
  font-family: 'Montserrat', 'sans-serif';
`;

interface Props {
  size?: string,
  className?: string,
  margin?: string,
  maxWidth?: string,
}

export const InfoText:React.FC<Props> = ({
  size = '1.4rem',
  margin = '64px auto 0',
  maxWidth = '300px',
  className,
  children,
}) => (
  <InfoTextStyled
    size={size}
    className={className}
    margin={margin}
    maxWidth={maxWidth}
  >
    {children}
  </InfoTextStyled>
);