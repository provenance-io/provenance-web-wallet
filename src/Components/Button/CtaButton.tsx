import PropTypes from 'prop-types';
import { combineCss } from 'Components';
import styled from 'styled-components';
import { Button, ButtonProps } from '.';

const CtaContainer = styled.div`
  position: absolute;
  bottom: 42px;
  left: 16px;
  right: 16px;

  ${combineCss()}
`;

export const CtaButton = ({ children, onClick, ...rest }: ButtonProps) => (
  <CtaContainer {...rest}>
    <Button variant="primary" onClick={onClick}>
      {children}
    </Button>
  </CtaContainer>
);

CtaButton.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func,
};
