import styled from 'styled-components';

interface StyledProps {
  direction: 'column' | 'row';
  childWidth: string;
  marginTop?: string;
  marginBottom?: string;
}

const Wrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  justify-content: center;
  width: 100%;
  ${({ marginTop }) => !!marginTop && `margin-top: ${marginTop};`}
  ${({ marginBottom }) => !!marginBottom && `margin-bottom: ${marginBottom};`}
  div {
    // Div is the button wrappers
    ${({ direction }) =>
      direction === 'column' &&
      `
      margin-top: 10px;
      &:first-child { margin-top: 0; }
    `}
    // In a row, first item will have no margin-left, last item will have no margin-right
    ${({ direction, childWidth }) =>
      direction === 'row' &&
      `
      margin: 4px;
      flex-basis: ${childWidth};
      &:first-child { margin-left: 0; }
      &:last-child { margin-right: 0; }
    `}
  }
`;

interface Props {
  children: React.ReactNode;
  direction?: 'column' | 'row';
  childWidth?: string;
  marginTop?: string;
  marginBottom?: string;
}

export const ButtonGroup: React.FC<Props> = ({
  children,
  direction = 'column',
  childWidth = '50%',
  marginTop,
  marginBottom,
}) => {
  return (
    <Wrapper
      direction={direction}
      childWidth={childWidth}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      {children}
    </Wrapper>
  );
};
