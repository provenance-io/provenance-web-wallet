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
    <g id={ICON_NAMES.ARROW_TALL}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 7 14">
        <path
          fill="currentColor"
          d="m.96 4.58 2.55-4 2.53 4-.63.31-1.47-1.56v9.7h-.85v-9.7L1.61 4.9l-.65-.31Z"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.CARET}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 5">
        <path fill="currentColor" d="M10 0 5 5 0 0h10Z" />
      </svg>
    </g>
    <g id={ICON_NAMES.CHECK}>
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
      </svg>
    </g>
    <g id={ICON_NAMES.CHEVRON}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 11">
        <path stroke="currentColor" strokeLinecap="square" d="m1 2 4 4-4 4" />
      </svg>
    </g>
    <g id={ICON_NAMES.CLOSE}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
        <path stroke="currentColor" d="m1 1 14 14m0-14L1 15" />
      </svg>
    </g>
    <g id={ICON_NAMES.COPY}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 16">
        <path stroke="currentColor" d="M4 3H1v12h8v-3" />
        <path stroke="currentColor" d="M4 1h4.5L12 4.5V12H4V1Z" />
        <path stroke="currentColor" d="M8 1v4h4" />
      </svg>
    </g>
    <g id={ICON_NAMES.CUBES}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="9.5 2 19 16">
      <path stroke="currentColor" d="m19 1-9 5v8l9 5 9-5V6l-9-5Zm0 10-9-5"/>
      <path stroke="currentColor" d="m28 6-9 5v8m-9-5-9 5v8l9 5 9-5v-8l-9-5Zm0 10-9-5"/>
      <path stroke="currentColor" d="m19 19-9 5v8m18-18-9 5v8l9 5 9-5v-8l-9-5Zm0 10-9-5"/>
      <path stroke="currentColor" d="m37 19-9 5v8"/>
    </svg>
    </g>
    <g id={ICON_NAMES.DASHBOARD}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 16">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M.5 1.1V4h16V1.1C16.5 0 15.4 0 15.4 0H1.6S.5 0 .5 1.1Zm6 4.9h-6v8.9C.5 16 1.6 16 1.6 16h4.9V6Zm2 10h6.9c1.1 0 1.1-1.1 1.1-1.1V6h-8v10Z"
          clipRule="evenodd"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.IN_PROGRESS}>
      <svg viewBox="0 0 18 18" fill="none">
        <path
          d="M9 0.5C10.6811 0.5 12.3245 0.998516 13.7223 1.93251C15.1202 2.8665 16.2096 4.19402 16.853 5.74719C17.4963 7.30036 17.6646 9.00943 17.3367 10.6583C17.0087 12.3071 16.1992 13.8217 15.0104 15.0104C13.8217 16.1992 12.3071 17.0087 10.6583 17.3367C9.00943 17.6646 7.30036 17.4963 5.74719 16.853C4.19402 16.2096 2.8665 15.1202 1.93251 13.7223C0.998516 12.3245 0.5 10.6811 0.5 9"
          stroke="currentColor"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.MENU}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 4 20">
        <circle cx="2" cy="2" r="2" fill="currentColor" />
        <circle cx="2" cy="10" r="2" fill="currentColor" />
        <circle cx="2" cy="18" r="2" fill="currentColor" />
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
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M16.1 15A9 9 0 0 0 9.5 0a9 9 0 0 0-6.7 15c.8-1.4 2-2.4 3.5-3a5.3 5.3 0 1 1 6.3 0 8.4 8.4 0 0 1 3.5 3Zm-1.5 1.4c-.3-.4-.6-1-1-1.3a6.4 6.4 0 0 0-4.1-1.8 5.7 5.7 0 0 0-5.2 3 9 9 0 0 0 10.3.1ZM9.5 11a3.3 3.3 0 1 0 0-6.7 3.3 3.3 0 0 0 0 6.7Z"
          clipRule="evenodd"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.QRCODE}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="23.5" stroke="currentColor" />
        <path
          stroke="currentColor"
          strokeWidth="1.222"
          d="M13.611 28.278h6.111v6.111h-6.111zm0-14.667h6.111v6.111h-6.111zm14.666 0h6.111v6.111h-6.111zM13 22.166h1.222m2.446 0h3.667m2.445 9.778H24m0 1.223h1.223m8.554-7.334H35m-6.111-1.223h1.222M13 25.833h1.222m.001-2.444h3.666m-3.666 1.222h2.444m4.889 9.777h7.333m-2.444-1.222h2.444m1.222-11H35m-2.444 1.223H35m-6.111 2.444h3.667m-2.445 1.222h1.222m1.834-.61v2.444m-2.445-1.834v4.278m-9.166-7.944h1.223m-2.445 1.222h4.889m8.555 9.777h-2.444m3.055-3.055v3.666m-18.944-9.166h7.334m-.613-10.389v4.89m-.611-6.723h1.222M25.832 13v3.667m-2.444-1.223v2.445m4.278 4.277h1.222m-4.278 9.167V30.11m.611-1.834h3.667m2.444 2.445h2.445M24.61 19.11v3.667m1.222-1.223V24m-2.444 6.11v-3.666m3.055 3.056h1.223m-.611-3.056V24m.61 3.055h1.223m0 6.111h2.444m-3.055-.61V30.11M25.22 18.5h1.223"
        />
        <path
          fill="currentColor"
          d="M15.445 15.444h2.444v2.444h-2.444zm0 14.667h2.444v2.444h-2.444zm14.666-14.667h2.444v2.444h-2.444z"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.TRANSACTIONS}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 20">
        <path
          fill="currentColor"
          d="m5.375 8-.937 1.171 2.437 1.95V8h-1.5Zm-2.5-2-.937-1.171L.474 6l1.464 1.171L2.875 6Zm2.5-2h1.5V.88L4.438 2.828 5.375 4Zm.937 2.829-2.5-2L1.938 7.17l2.5 2 1.874-2.34Zm-2.5.342 2.5-2L4.438 2.83l-2.5 2 1.874 2.34ZM6.875 8V4h-3v4h3Zm6.5 8 .937 1.171-2.436 1.95v-3.12l1.5-.001Zm2.5-2 .937-1.171 1.464 1.17-1.464 1.172L15.875 14Zm-2.5-2h-1.5V8.88l2.437 1.95-.937 1.17Zm-.937 2.829 2.5-2 1.874 2.342-2.5 2-1.874-2.342Zm2.5.342-2.5-2 1.874-2.342 2.5 2-1.874 2.342Zm-3.063.83v-4l3-.001v4h-3Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="square"
          strokeWidth="3"
          d="M5.375 6h10.5m-2.5 8.5h-10.5"
        />
      </svg>
    </g>
    <g id={ICON_NAMES.CHAIN}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="23.5" fill="#03DAD5" stroke="#03C9C6"/>
        <path fill="#1A1C23" fillRule="evenodd" d="m16.07 21.98-.01-.02a3.93 3.93 0 0 1-.89-1.62c-.25-.9-.22-2.25 1.36-3.83s2.93-1.6 3.85-1.35a4.1 4.1 0 0 1 1.62.88v.01l.92.91a1 1 0 1 0 1.42-1.41l-.92-.92-.7.7.7-.7-.02-.02a2.34 2.34 0 0 0-.19-.16 5.93 5.93 0 0 0-2.3-1.22c-1.6-.44-3.7-.23-5.79 1.86-2.09 2.09-2.31 4.17-1.88 5.77a6.01 6.01 0 0 0 1.42 2.53l3.56 3.57a5.28 5.28 0 0 0 4.03 1.6 6.54 6.54 0 0 0 4.27-2.06 1 1 0 0 0-1.4-1.42 4.62 4.62 0 0 1-2.97 1.49 3.3 3.3 0 0 1-2.51-1.03l-3.57-3.56Zm15.88 4 .01.02a2.67 2.67 0 0 1 .33.42c.2.3.43.7.56 1.2.25.9.22 2.25-1.36 3.84-1.58 1.58-2.93 1.6-3.85 1.35a4.1 4.1 0 0 1-1.62-.89L25.1 31a1 1 0 0 0-1.42 1.41l.92.92.7-.7-.7.7.02.02a2.34 2.34 0 0 0 .19.17 5.9 5.9 0 0 0 2.3 1.21c1.6.44 3.7.23 5.8-1.86 2.08-2.09 2.3-4.17 1.87-5.77a6.01 6.01 0 0 0-1.42-2.53l-3.56-3.56a5.29 5.29 0 0 0-4.03-1.62c-1.5.08-2.99.79-4.27 2.07a1 1 0 0 0 1.41 1.42c1-1 2.04-1.44 2.96-1.49.9-.04 1.78.3 2.51 1.03l3.57 3.56Z" clipRule="evenodd"/>
      </svg>
    </g>
    <g id={ICON_NAMES.WARNING}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 23">
        <path fill="currentColor" fillRule="evenodd" d="M13.5 1.4a1.7 1.7 0 0 0-3 0L.2 19.8c-.6 1.2.2 2.7 1.6 2.7h20.4c1.4 0 2.2-1.5 1.6-2.7L13.5 1.4ZM13 9.5v5a1 1 0 1 1-2 0v-5a1 1 0 1 1 2 0Zm-1 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
    </g>
    <g id={ICON_NAMES.INFO}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
    </g>
  </Svg>
);
