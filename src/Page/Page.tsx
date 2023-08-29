import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { COLORS, FONTS } from 'theme';
import bg from 'images/bg.png';

interface Props {
  children?: React.ReactNode;
  bgImage?: boolean;
  align?: string;
  justify?: string;
  height?: string;
}

const PageStyled = styled.div<Props>`
  align-items: ${({ align }) => align};
  background: ${({ bgImage }) =>
    bgImage ? `${COLORS.BACKGROUND_1} url(${bg}) no-repeat` : COLORS.BACKGROUND_1};
  background-size: cover;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: ${FONTS.SECONDARY_FONT};
  justify-content: ${({ justify }) => justify};
  text-align: ${({ align }) => (align === 'flex-start' ? 'left' : 'center')};
  z-index: 10;
  height: ${({ height }) => height};
  width: 100%;
  min-height: 600px;
  min-width: 375px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const Banner = styled.div`
  margin: 20px;
  padding: 20px;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: left;
  background: #3677ea;

  @media (min-width: 648px) {
    width: 100%;
    max-width: 648px;
    margin: 20px auto;
  }

  & > header {
    margin-bottom: 10px;
    font-size: 1.5rem;
    line-height: 2rem;
  }

  & > a {
    color: white;
    text-decoration: underline;
  }

  & > button {
    display: block;
    margin-top: 10px;
    padding: 4px 10px;
    border: none;
    border-radius: 4px;
    color: #3677ea;
    font-size: 1.125rem;
    line-height: 1.75rem;
    background: white;
    cursor: pointer;
  }
`;

export const Page = ({
  children = null,
  bgImage,
  align = 'flex-start',
  justify = 'flex-start',
  height = 'auto',
}: Props) => {
  const [show, setShow] = React.useState(false);

  return (
    <PageStyled bgImage={bgImage} align={align} justify={justify} height={height}>
      <Banner>
        <header>
          Notice: The Provenance Blockchain Wallet is no longer supported.
        </header>
        {show && (
          <>
            The Provenance Blockchain Wallet can only be used to “send” assets to
            another wallet. Learn more about available wallet options at:{' '}
            <a
              href="https://provenance.io/ecosystem/HASH/#:~:text=Purchase%20%3E-,Digital%20Wallets,-Use%20the%20following"
              target="_blank"
              rel="noreferrer"
            >
              https://provenance.io/ecosystem/HASH/
            </a>
          </>
        )}
        <button onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Learn More'}
        </button>
      </Banner>
      <Outlet />
      {children}
    </PageStyled>
  );
};
