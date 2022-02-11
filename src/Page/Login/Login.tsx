import { Button, H1 } from 'Components';
import { css } from 'styled-components';

export const Login = () => (
  <div>
    <H1
      $css={css`
        font-size: 2rem;
      `}
    >
      Login Page
    </H1>
    <Button>Click Here</Button>
  </div>
);
