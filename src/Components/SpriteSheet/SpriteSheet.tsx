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
    <g id={ICON_NAMES.DASHBOARD}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 16">
        <path fill="currentColor" fillRule="evenodd" d="M.5 1.1V4h16V1.1C16.5 0 15.4 0 15.4 0H1.6S.5 0 .5 1.1Zm6 4.9h-6v8.9C.5 16 1.6 16 1.6 16h4.9V6Zm2 10h6.9c1.1 0 1.1-1.1 1.1-1.1V6h-8v10Z" clipRule="evenodd"/>
      </svg>
    </g>
    <g id={ICON_NAMES.MENU}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 4 20">
        <circle cx="2" cy="2" r="2" fill="currentColor"/>
        <circle cx="2" cy="10" r="2" fill="currentColor"/>
        <circle cx="2" cy="18" r="2" fill="currentColor"/>
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
    <g id={ICON_NAMES.PROFILE}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 18">
        <path fill="currentColor" fillRule="evenodd" d="M16.1 15A9 9 0 0 0 9.5 0a9 9 0 0 0-6.7 15c.8-1.4 2-2.4 3.5-3a5.3 5.3 0 1 1 6.3 0 8.4 8.4 0 0 1 3.5 3Zm-1.5 1.4c-.3-.4-.6-1-1-1.3a6.4 6.4 0 0 0-4.1-1.8 5.7 5.7 0 0 0-5.2 3 9 9 0 0 0 10.3.1ZM9.5 11a3.3 3.3 0 1 0 0-6.7 3.3 3.3 0 0 0 0 6.7Z" clipRule="evenodd"/>
      </svg>
    </g>
    <g id={ICON_NAMES.QRCODE}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="23.5" stroke="currentColor"/>
        <path stroke="currentColor" strokeWidth="1.222" d="M13.611 28.278h6.111v6.111h-6.111zm0-14.667h6.111v6.111h-6.111zm14.666 0h6.111v6.111h-6.111zM13 22.166h1.222m2.446 0h3.667m2.445 9.778H24m0 1.223h1.223m8.554-7.334H35m-6.111-1.223h1.222M13 25.833h1.222m.001-2.444h3.666m-3.666 1.222h2.444m4.889 9.777h7.333m-2.444-1.222h2.444m1.222-11H35m-2.444 1.223H35m-6.111 2.444h3.667m-2.445 1.222h1.222m1.834-.61v2.444m-2.445-1.834v4.278m-9.166-7.944h1.223m-2.445 1.222h4.889m8.555 9.777h-2.444m3.055-3.055v3.666m-18.944-9.166h7.334m-.613-10.389v4.89m-.611-6.723h1.222M25.832 13v3.667m-2.444-1.223v2.445m4.278 4.277h1.222m-4.278 9.167V30.11m.611-1.834h3.667m2.444 2.445h2.445M24.61 19.11v3.667m1.222-1.223V24m-2.444 6.11v-3.666m3.055 3.056h1.223m-.611-3.056V24m.61 3.055h1.223m0 6.111h2.444m-3.055-.61V30.11M25.22 18.5h1.223"/>
        <path fill="currentColor" d="M15.445 15.444h2.444v2.444h-2.444zm0 14.667h2.444v2.444h-2.444zm14.666-14.667h2.444v2.444h-2.444z"/>
      </svg>
    </g>
    <g id={ICON_NAMES.TRANSACTIONS}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 20">
        <path fill="currentColor" d="m5.375 8-.937 1.171 2.437 1.95V8h-1.5Zm-2.5-2-.937-1.171L.474 6l1.464 1.171L2.875 6Zm2.5-2h1.5V.88L4.438 2.828 5.375 4Zm.937 2.829-2.5-2L1.938 7.17l2.5 2 1.874-2.34Zm-2.5.342 2.5-2L4.438 2.83l-2.5 2 1.874 2.34ZM6.875 8V4h-3v4h3Zm6.5 8 .937 1.171-2.436 1.95v-3.12l1.5-.001Zm2.5-2 .937-1.171 1.464 1.17-1.464 1.172L15.875 14Zm-2.5-2h-1.5V8.88l2.437 1.95-.937 1.17Zm-.937 2.829 2.5-2 1.874 2.342-2.5 2-1.874-2.342Zm2.5.342-2.5-2 1.874-2.342 2.5 2-1.874 2.342Zm-3.063.83v-4l3-.001v4h-3Z"/>
        <path stroke="currentColor" strokeLinecap="square" strokeWidth="3" d="M5.375 6h10.5m-2.5 8.5h-10.5"/>
      </svg>
    </g>
  </Svg>
);
