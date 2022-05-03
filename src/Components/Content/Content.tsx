import styled from 'styled-components';

const ContentStyled = styled.div<{padBottom?: string}>`
  width: 100%;
  /* padding: 10px 20px; */
  ${({ padBottom }) => padBottom && `padding-bottom: ${padBottom};` }
`;

interface Props {
  children: React.ReactNode;
  padBottom?: string;
}

export const Content:React.FC<Props> = ({children, padBottom}) => {
  return (
    <ContentStyled padBottom={padBottom}>
      {children}
    </ContentStyled>
  )
};
