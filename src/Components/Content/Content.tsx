import styled from 'styled-components';
import { MAX_HEIGHT, MAX_WIDTH } from 'consts';

const ContentStyled = styled.div<{ padBottom?: string }>`
  position: relative;
  max-width: ${MAX_WIDTH};
  max-height: ${MAX_HEIGHT};
  height: ${MAX_HEIGHT};
  width: ${MAX_WIDTH};
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

export const Content: React.FC<Props> = ({ children, padBottom }) => {
  return <ContentStyled padBottom={padBottom}>{children}</ContentStyled>;
};
