import { useState } from 'react';
import styled from 'styled-components';
import { DEFAULT_GAS_ADJUSTMENT, PROVENANCE_DOCS_GAS_FEE } from 'consts';
import { InputDrag } from '../InputDrag/InputDrag';
import { FullPagePopup } from '../FullPagePopup/FullPagePopup';
import { Button } from 'Components/Button/Button';
import { BottomFloat } from 'Components/BottomFloat';
import { ButtonGroup } from 'Components/Button';
import { Typo } from 'Components/Typography/Typo';
import { COLORS } from 'theme';

const GasAdjRow = styled.div`
  border-top: 1px solid ${COLORS.NEUTRAL_600};
  color: ${COLORS.PRIMARY_400};
  padding: 16px 8px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    color: ${COLORS.PRIMARY_450};
  }
`;
const GasAdjContent = styled.div`
  font-size: 1.4rem;
  &:nth-child(1) {
    margin-right: 6px;
    min-width: 80px;
    text-align: left;
  }
  &:nth-child(2) {
    margin-left: 6px;
    text-align: right;
    word-break: break-word;
  }
`;
const LearnMoreLink = styled.a`
  font-size: 1.2rem;
`;

interface Props {
  onChange: (value: string) => void;
  value: string;
}

export const GasAdjustment: React.FC<Props> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Keep a local value, only apply it if the user clicks the "apply" button
  const [localGasAdjustmentValue, setLocalGasAdjustmentValue] = useState(value);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const handleApply = () => {
    // Set the value in parent component
    onChange(localGasAdjustmentValue);
    // Close this popup
    setIsOpen(false);
  };

  return isOpen ? (
    <FullPagePopup
      title="Set Gas Adjustment"
      close={toggleOpen}
      height="auto"
      wordBreak="break-word"
    >
      <Typo type="body" align="left" marginBottom="10px" color="NEUTRAL_250">
        GAS fee calculation:
      </Typo>
      <Typo type="code" marginBottom="10px">
        (GAS * GAS_ADJUSTMENT) * GAS price = FEE amount
      </Typo>
      <Typo type="body" align="left" marginBottom="20px" color="NEUTRAL_250">
        The higher the GAS fee, the higher the probability of being selected and
        packaged into a block by the validator
      </Typo>
      <LearnMoreLink href={PROVENANCE_DOCS_GAS_FEE} target="_blank" rel="noreferrer">
        Learn more
      </LearnMoreLink>
      <InputDrag
        max="5.0"
        defaultValue={DEFAULT_GAS_ADJUSTMENT}
        value={localGasAdjustmentValue}
        onChange={setLocalGasAdjustmentValue}
      />
      <BottomFloat>
        <ButtonGroup>
          <Button onClick={handleApply}>Apply</Button>
          <Button
            variant="secondary"
            onClick={() => setLocalGasAdjustmentValue(DEFAULT_GAS_ADJUSTMENT)}
          >
            Reset to Default
          </Button>
        </ButtonGroup>
      </BottomFloat>
    </FullPagePopup>
  ) : (
    <GasAdjRow onClick={toggleOpen}>
      <GasAdjContent>Gas Adjustment</GasAdjContent>
      <GasAdjContent>x{Number(value)}</GasAdjContent>
    </GasAdjRow>
  );
};
