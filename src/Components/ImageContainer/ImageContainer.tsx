import styled from 'styled-components';

type WrapperProps = {
  centered?: boolean;
  size?: string;
};

const Wrapper = styled.div<WrapperProps>`
  margin: ${({ centered }) => centered && '0 auto'};
  width: ${({ size }) => size && size};
`;

const Img = styled.img`
  width: 100%;
`;

type ImageContainerProps = {
  alt: string;
  src: string;
} & WrapperProps;

export const ImageContainer = ({ centered = false, size, ...rest }: ImageContainerProps) => (
  <Wrapper centered={centered} size={size}>
    <Img {...rest} />
  </Wrapper>
);
