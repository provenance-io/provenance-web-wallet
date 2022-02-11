import React from 'react';
import styled from 'styled-components';
import { ICON_NAMES } from 'consts';

const Svg = styled.svg`
  display: none;
`;

/**
 * Inject *SpriteSheet* into the root of your application or *Sprite* component won't render anything.
 *
 * `fill` and `stroke` must be set to `"currentColor"` otherwise it won't inherit `color` prop from *Sprite*.
 */
export const SpriteSheet = () => (
  <Svg xmlns="http://www.w3.org/2000/svg">
    <g id={ICON_NAMES.ARROW}>
      <svg viewBox="0 0 16 16" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.46992 0.46967C7.76281 0.176777 8.23768 0.176777 8.53058 0.46967C8.82347 0.762563 8.82347 1.23744 8.53058 1.53033L2.81078 7.25012H15C15.4142 7.25012 15.75 7.58591 15.75 8.00012C15.75 8.41434 15.4142 8.75012 15 8.75012H2.81103L8.53058 14.4697C8.82347 14.7626 8.82347 15.2374 8.53058 15.5303C8.23768 15.8232 7.76281 15.8232 7.46992 15.5303L0.483832 8.54425C0.33981 8.40758 0.25 8.21434 0.25 8.00012C0.25 7.78888 0.33733 7.59804 0.477856 7.46173L7.46992 0.46967Z"
          fill="currentColor"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.CLOSE}>
      <svg viewBox="0 0 14 14" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.1893 0.68934C11.7751 0.103553 12.7249 0.103553 13.3107 0.68934C13.8964 1.27513 13.8964 2.22487 13.3107 2.81066L9.12132 7L13.3107 11.1893C13.8964 11.7751 13.8964 12.7249 13.3107 13.3107C12.7249 13.8964 11.7751 13.8964 11.1893 13.3107L7 9.12132L2.81066 13.3107C2.22487 13.8964 1.27513 13.8964 0.689339 13.3107C0.103554 12.7249 0.103554 11.7751 0.689339 11.1893L4.87868 7L0.689341 2.81066C0.103554 2.22487 0.103554 1.27513 0.689341 0.68934C1.27513 0.103553 2.22487 0.103553 2.81066 0.68934L7 4.87868L11.1893 0.68934Z"
          fill="currentColor"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.PROVENANCE}>
      <svg fill="none" viewBox="0 0 32 32">
        <path
          fill="currentColor"
          d="M17.2 3.5L11.5 0 5.7 3.5 0 7v21.6L5.8 32v-9.9l5.7 3.5 5.8-3.5 5.7-3.5V7l-5.8-3.5zm-5.7 16.3l-5.8-3.5v-5.8L11.5 7l5.7 3.5v5.8l-5.7 3.5z"
        />
      </svg>
    </g>
  </Svg>
);
