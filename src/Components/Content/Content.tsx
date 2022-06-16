import styled from 'styled-components';

const ContentStyled = styled.div<{padBottom?: string}>`
  width: 100%;
  /* padding: 10px 20px; */
  ${({ padBottom }) => padBottom && `padding-bottom: ${padBottom};` }
  // Prevent scroll bar
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
  ::-webkit-scrollbar { /* WebKit */
    width: 0px;
  }
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
