import styled from 'styled-components';

interface StyledProps {
  layout: 'float' | 'inline';
  direction: 'column' | 'row';
}

const Wrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  width: 100%;
  bottom: 0;
  padding: 0px 16px 20px 16px;
  ${({ layout }) => layout === 'float' && `
    position: fixed;
    bottom: 0;
    left: 0;
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
}

export const ButtonGroup:React.FC<Props> = ({ children, layout = 'float', direction = 'column' }) => {
  return (
    <Wrapper layout={layout} direction={direction}>
      {children}
    </Wrapper>
  )
};
