import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { COLORS } from 'theme';
import { keyPress } from 'utils';

const CopyArea = styled.div`
  cursor: pointer;
  position: relative;
  text-align: inherit;
  display: inline-block;
`;
const CopiedNotice = styled.div<{ child: React.ReactNode }>`
  background: ${COLORS.PRIMARY_500};
  color: white;
  position: absolute;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;
  top: 150%;
  left: 40%;
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
    border-bottom: 10px solid ${COLORS.PRIMARY_500};
  }
`;

interface Props {
  value?: string;
  specialValue?: string;
  title?: string;
  successText?: string;
  children?: React.ReactNode;
  noPopup?: boolean;
  className?: string;
}

export const CopyValue: React.FC<Props> = ({
  value = '',
  specialValue,
  title = 'Copy Text',
  children,
  successText = 'Copied!',
  noPopup = false,
  className,
}) => {
  const [justCopied, setJustCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState(0);
  const childRef = useRef(null);

  // Kill any times when unmounted (prevent memory leaks w/running timers)
  useEffect(
    () => () => {
      if (timeoutInstance) {
        clearTimeout(timeoutInstance);
      }
    },
    [timeoutInstance]
  );

  const handleCopyClick = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    setJustCopied(false);
    clearTimeout(timeoutInstance);
    const copyValue = specialValue && event.metaKey ? specialValue : value;
    navigator.clipboard.writeText(copyValue).then(() => {
      clearTimeout(timeoutInstance);
      setJustCopied(true);
      const newTimeoutInstance = window.setTimeout(() => {
        setJustCopied(false);
      }, 2000);
      setTimeoutInstance(newTimeoutInstance);
    });
  };

  return (
    <CopyArea
      className={className}
      title={title}
      onClick={handleCopyClick}
      tabIndex={0}
      onKeyPress={(e) => keyPress(e, () => handleCopyClick(e))}
    >
      {justCopied && noPopup ? successText : children}
      {justCopied && !noPopup && (
        <CopiedNotice child={childRef.current}>{successText}</CopiedNotice>
      )}
    </CopyArea>
  );
};
