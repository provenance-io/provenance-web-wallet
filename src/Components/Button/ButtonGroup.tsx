import styled from 'styled-components';

interface StyledProps {
  direction: 'column' | 'row';
}

const Wrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  width: 100%;
  button {
    ${({ direction }) => direction === 'column' && `
      margin-top: 10px;
    `}
    ${({ direction }) => direction === 'row' && `
      margin-left: 10px;
    `}
  }
  div:first-child {
    button {
      margin-top: 0;
      margin-left: 0;
    }
  }
`;

interface Props {
  children: React.ReactNode;
  direction?: 'column' | 'row';
}

export const ButtonGroup:React.FC<Props> = ({ children, direction = 'column' }) => {
  return (
    <Wrapper direction={direction}>
      {children}
    </Wrapper>
  )
};
