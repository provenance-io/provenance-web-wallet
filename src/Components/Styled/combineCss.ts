import { css, FlattenSimpleInterpolation } from 'styled-components';
import type { InterpolationWithProps } from './Styled';

/**
 * When composing Styled components, you need to combineCss to allow for inline $css props where
 * the component is being consumed to be passed properly to the composed component. You may choose
 * where to add ${combineCss()} in the interpolation string depending on priority of styles.
 */
export const combineCss = () => css`
  ${({ $css }: { $css?: FlattenSimpleInterpolation | InterpolationWithProps }) =>
    $css && $css}
`;

/**
 * Similar to combineCss() except has a higher selecting specificity, using { && $css... }
 */
export const combineStrictCss = () => css`
  && {
    ${({ $css }: { $css?: FlattenSimpleInterpolation | InterpolationWithProps }) =>
      $css && $css};
  }
`;
