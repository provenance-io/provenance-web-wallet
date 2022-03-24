import styled from 'styled-components';

interface StyleProps {
  size: string,
  weight: string | number,
  margin: string,
}

const TitleStyled = styled.h1<StyleProps>`
  font-size: ${({ size }) => size};
  letter-spacing: 0.6rem;
  font-weight: ${({ weight }) => weight};
  text-transform: uppercase;
  line-height: 2.6rem;
  margin: ${({ margin }) => margin};
  font-family: 'Montserrat', 'sans-serif';
`;

interface Props {
  weight?: number | string,
  size?: string,
  className?: string,
  margin?: string,
}

export const Title:React.FC<Props> = ({
  size = '2.1rem',
  weight = 700,
  margin = '40px 0 0 0',
  className,
  children,
}) => (
  <TitleStyled
    size={size}
    weight={weight}
    className={className}
    margin={margin}
  >
    {children}
  </TitleStyled>
);