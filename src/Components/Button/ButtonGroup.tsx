import styled from 'styled-components';

interface StyledProps {
  layout: 'float' | 'inline';
  direction: 'column' | 'row';
  background?: string;
}

const Wrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  ${({ background }) => background && `background: ${background};` }
  width: 100%;
  bottom: 0;
  padding: 20px 16px 20px 16px;
  ${({ layout }) => layout === 'float' && `
    position: fixed;
    bottom: 0;
    left: 0;
    width:inherit;
    z-index: 20;
  `}
  button {
    ${({ direction }) => direction === 'column' && `
      margin-top: 10px;
    `}
    ${({ direction }) => direction === 'row' && `
      margin-left: 10px;
    `}
  }
  button:first-child {
    margin-top: 0;
    margin-left: 0;
  }
`;

interface Props {
  children: React.ReactNode;
  layout?: 'float' | 'inline';
  direction?: 'column' | 'row';
  background?: string,
}

export const ButtonGroup:React.FC<Props> = ({ children, layout = 'float', direction = 'column', background }) => {
  return (
    <Wrapper layout={layout} direction={direction} background={background}>
      {children}
    </Wrapper>
  )
};
