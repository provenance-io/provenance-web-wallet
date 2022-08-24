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
    <g id={ICON_NAMES.ARROW_TALL}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 7 14">
        <path
          fill="currentColor"
          d="m.96 4.58 2.55-4 2.53 4-.63.31-1.47-1.56v9.7h-.85v-9.7L1.61 4.9l-.65-.31Z"
        />
      </svg>
    </g>
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
    <g id={ICON_NAMES.CARET}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 5">
        <path fill="currentColor" d="M10 0 5 5 0 0h10Z" />
      </svg>
    </g>
    <g id={ICON_NAMES.CHAIN}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="13.71" stroke="currentColor" strokeWidth=".58" />
        <g clipPath="url(#a)">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="m9.38 12.82-.01-.01-.05-.05a2.27 2.27 0 0 1-.47-.9c-.14-.52-.13-1.3.8-2.23.92-.92 1.7-.94 2.24-.79a2.39 2.39 0 0 1 .94.52l.54.54a.58.58 0 1 0 .83-.83l-.54-.53-.4.4.4-.4v-.01h-.01a2.09 2.09 0 0 0-.1-.1 3.46 3.46 0 0 0-1.35-.71c-.94-.26-2.16-.14-3.38 1.08-1.22 1.22-1.35 2.43-1.1 3.37.24.88.8 1.44.83 1.47l2.08 2.08c.64.65 1.47.99 2.35.94a3.81 3.81 0 0 0 2.5-1.2.58.58 0 1 0-.83-.83 2.7 2.7 0 0 1-1.73.87 1.92 1.92 0 0 1-1.46-.6l-2.08-2.08Zm9.25 2.34h.02a1.63 1.63 0 0 1 .19.25c.11.17.25.41.32.7.15.53.13 1.32-.8 2.24-.92.92-1.7.93-2.24.79a2.39 2.39 0 0 1-.94-.52l-.54-.54a.58.58 0 0 0-.83.83l.54.53.4-.4-.4.4.01.01a1.34 1.34 0 0 0 .1.1 3.45 3.45 0 0 0 1.35.71c.94.26 2.16.13 3.38-1.09 1.22-1.21 1.35-2.43 1.1-3.36a3.5 3.5 0 0 0-.83-1.48l-2.08-2.08a3.08 3.08 0 0 0-2.35-.94c-.87.04-1.74.46-2.5 1.21a.58.58 0 1 0 .83.83c.6-.6 1.2-.85 1.73-.87.52-.03 1.04.17 1.47.6l2.07 2.08Z"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path
              fill="currentColor"
              d="M0 0h12.83v12.83H0z"
              transform="translate(7.58 7.58)"
            />
          </clipPath>
        </defs>
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
        <path stroke="currentColor" d="m19 1-9 5v8l9 5 9-5V6l-9-5Zm0 10-9-5" />
        <path
          stroke="currentColor"
          d="m28 6-9 5v8m-9-5-9 5v8l9 5 9-5v-8l-9-5Zm0 10-9-5"
        />
        <path
          stroke="currentColor"
          d="m19 19-9 5v8m18-18-9 5v8l9 5 9-5v-8l-9-5Zm0 10-9-5"
        />
        <path stroke="currentColor" d="m37 19-9 5v8" />
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
    <g id={ICON_NAMES.INFO}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    </g>
    <g id={ICON_NAMES.IN_PROGRESS}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="currentColor"
          strokeDasharray="165 57"
          strokeWidth="10"
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
    <g id={ICON_NAMES.NOTIFICATION}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28">
        <mask
          id="a"
          width="20"
          height="20"
          x="4"
          y="4"
          fill="#000"
          maskUnits="userSpaceOnUse"
        >
          <path fill="currentColor" d="M4 4h20v20H4z" />
          <path d="M7 15.4C7 10.3 9 5 14 5s7 5.3 7 10.4c0 6 2 7.6 2 7.6H5s2-2.5 2-7.6Z" />
        </mask>
        <path
          fill="currentColor"
          d="m5 23-.78-.62A1 1 0 0 0 5 24v-1Zm18 0v1a1 1 0 0 0 .62-1.78L23 23ZM14 4c-2.93 0-4.98 1.59-6.24 3.8C6.52 9.95 6 12.74 6 15.4h2c0-2.44.48-4.85 1.5-6.61C10.47 7.07 11.92 6 14 6V4ZM6 15.4c0 2.41-.47 4.19-.93 5.34a8.9 8.9 0 0 1-.85 1.63v.01L5 23l.78.62.02-.02a1.95 1.95 0 0 0 .1-.15c.07-.1.17-.23.27-.41.21-.36.49-.88.76-1.56C7.47 20.1 8 18.08 8 15.4H6ZM5 24h18v-2H5v2Zm18-1 .63-.78.01.01-.01-.01a4.72 4.72 0 0 1-.7-1.17c-.45-1-.93-2.76-.93-5.65h-2c0 3.11.52 5.15 1.08 6.45a6.7 6.7 0 0 0 1.12 1.77 2.42 2.42 0 0 0 .15.14l.01.01h.01v.01L23 23Zm-1-7.6c0-2.65-.52-5.44-1.76-7.6C18.98 5.58 16.94 4 14 4v2c2.07 0 3.52 1.07 4.5 2.79 1.02 1.76 1.5 4.17 1.5 6.61h2Z"
          mask="url(#a)"
        />
        <path fill="currentColor" d="M14.5 3a.5.5 0 0 0-1 0h1Zm0 1.5V3h-1v1.5h1Z" />
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
    <g id={ICON_NAMES.WARNING}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 23">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M13.5 1.4a1.7 1.7 0 0 0-3 0L.2 19.8c-.6 1.2.2 2.7 1.6 2.7h20.4c1.4 0 2.2-1.5 1.6-2.7L13.5 1.4ZM13 9.5v5a1 1 0 1 1-2 0v-5a1 1 0 1 1 2 0Zm-1 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
    </g>
  </Svg>
);
