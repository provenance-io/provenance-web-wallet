import styled from 'styled-components';

const ContentStyled = styled.div`
  width: 100%;
  padding: 10px 20px;
`;

interface Props {
  children: React.ReactNode;
}

export const Content:React.FC<Props> = ({children}) => {
  return (
    <ContentStyled>
      {children}
    </ContentStyled>
  )
};
