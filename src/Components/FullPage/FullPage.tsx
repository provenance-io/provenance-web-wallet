import styled from 'styled-components';

const FullPageStyled = styled.div<{ padBottom?: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 32px 16px 20px 16px;
  ${({ padBottom }) => padBottom && `padding-bottom: ${padBottom};`}
  // Prevent scroll bar
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  ::-webkit-scrollbar {
    /* WebKit */
    width: 0px;
  }
`;

interface Props {
  children: React.ReactNode;
  padBottom?: string;
}

export const FullPage: React.FC<Props> = ({ children, padBottom }) => {
  return <FullPageStyled padBottom={padBottom}>{children}</FullPageStyled>;
};
