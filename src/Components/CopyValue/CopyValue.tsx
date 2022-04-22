import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { COLORS } from 'theme';

const CopyArea = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
`;
const CopiedNotice = styled.div`
  background: ${COLORS.SECONDARY_650};
  color: white;
  position: absolute;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;
  bottom: -30px;
  left: -8px;
  width: 60px;
  box-sizing: content-box;
  &:before {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: -10px;
    left: 30px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid ${COLORS.SECONDARY_650};
  }
`;

interface Props {
  value: string,
  title?: string,
  children?: React.ReactNode,
}


export const CopyValue:React.FC<Props> = ({ value, title = 'Copy Text', children }) => {
  const [justCopied, setJustCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState(0);

  // Kill any times when unmounted (prevent memory leaks w/running timers)
  useEffect(() => () => { if (timeoutInstance) { clearTimeout(timeoutInstance); } },
    [timeoutInstance]
  );

  const handleCopyClick = () => {
    setJustCopied(false);
    clearTimeout(timeoutInstance);
    navigator.clipboard.writeText(value).then(() => {
      clearTimeout(timeoutInstance);
      setJustCopied(true);
      const newTimeoutInstance = window.setTimeout(() => {
        setJustCopied(false);
      }, 2000);
      setTimeoutInstance(newTimeoutInstance);
    });
  };

  return (
    <CopyArea title={title} onClick={handleCopyClick}>
      {children}
      {justCopied && <CopiedNotice>Copied!</CopiedNotice>}
    </CopyArea>
  );
};
