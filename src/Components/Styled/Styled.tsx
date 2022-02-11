import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import type { FlattenInterpolation, ThemedStyledProps } from 'styled-components';
import { combineStrictCss } from './combineCss';

export type InterpolationWithProps = FlattenInterpolation<ThemedStyledProps<any, any>>;

export type StyledProps = {
  $css?: FlattenSimpleInterpolation | InterpolationWithProps;
};

const StyledCss = css<StyledProps>`
  ${combineStrictCss()};
`;

/**
 * All React supported tags, minus some of the unnecessary ones. https://react-cn.github.io/react/docs/tags-and-attributes.html
 */

const A = styled.a<StyledProps>`
  ${StyledCss}
`;
const Address = styled.address<StyledProps>`
  ${StyledCss}
`;
const Aside = styled.aside<StyledProps>`
  ${StyledCss}
`;
const B = styled.b<StyledProps>`
  ${StyledCss}
`;
const Blockquote = styled.blockquote<StyledProps>`
  ${StyledCss}
`;
const Body = styled.body<StyledProps>`
  ${StyledCss}
`;
const Br = styled.br<StyledProps>`
  ${StyledCss}
`;
const Button = styled.button<StyledProps>`
  ${StyledCss}
`;
const Caption = styled.caption<StyledProps>`
  ${StyledCss}
`;
const Colgroup = styled.colgroup<StyledProps>`
  ${StyledCss}
`;
const Data = styled.data<StyledProps>`
  ${StyledCss}
`;
const Datalist = styled.datalist<StyledProps>`
  ${StyledCss}
`;
const Dd = styled.dd<StyledProps>`
  ${StyledCss}
`;
const Del = styled.del<StyledProps>`
  ${StyledCss}
`;
const Details = styled.details<StyledProps>`
  ${StyledCss}
`;
const Dialog = styled.dialog<StyledProps>`
  ${StyledCss}
`;
const Div = styled.div<StyledProps>`
  ${StyledCss}
`;
const Dl = styled.dl<StyledProps>`
  ${StyledCss}
`;
const Dt = styled.dt<StyledProps>`
  ${StyledCss}
`;
const Em = styled.em<StyledProps>`
  ${StyledCss}
`;
const Fieldset = styled.fieldset<StyledProps>`
  ${StyledCss}
`;
const Footer = styled.footer<StyledProps>`
  ${StyledCss}
`;
/**
 * A styled Formik Form component that can take a $css prop. Should be wrapped in a `<Formik>`.
 */
const Form = styled.form<StyledProps>`
  ${StyledCss}
`;
const H1 = styled.h1<StyledProps>`
  ${StyledCss}
`;
const H2 = styled.h2<StyledProps>`
  ${StyledCss}
`;
const H3 = styled.h3<StyledProps>`
  ${StyledCss}
`;
const H4 = styled.h4<StyledProps>`
  ${StyledCss}
`;
const H5 = styled.h5<StyledProps>`
  ${StyledCss}
`;
const H6 = styled.h6<StyledProps>`
  ${StyledCss}
`;
const Head = styled.head<StyledProps>`
  ${StyledCss}
`;
const Header = styled.header<StyledProps>`
  ${StyledCss}
`;
const Hr = styled.hr<StyledProps>`
  ${StyledCss}
`;
const I = styled.i<StyledProps>`
  ${StyledCss}
`;
const Iframe = styled.iframe<StyledProps>`
  ${StyledCss}
`;
const Img = styled.img<StyledProps>`
  ${StyledCss}
`;
const Input = styled.input<StyledProps>`
  ${StyledCss}
`;
const Label = styled.label<StyledProps>`
  ${StyledCss}
`;
const Legend = styled.legend<StyledProps>`
  ${StyledCss}
`;
const Li = styled.li<StyledProps>`
  ${StyledCss}
`;
const Main = styled.main<StyledProps>`
  ${StyledCss}
`;
const Menu = styled.menu<StyledProps>`
  ${StyledCss}
`;
const Menuitem = styled.menuitem<StyledProps>`
  ${StyledCss}
`;
const Nav = styled.nav<StyledProps>`
  ${StyledCss}
`;
const Ol = styled.ol<StyledProps>`
  ${StyledCss}
`;
const Option = styled.option<StyledProps>`
  ${StyledCss}
`;
const P = styled.p<StyledProps>`
  ${StyledCss}
`;
const Section = styled.section<StyledProps>`
  ${StyledCss}
`;
const Select = styled.select<StyledProps>`
  ${StyledCss}
`;
const Span = styled.span<StyledProps>`
  ${StyledCss}
`;
const Strong = styled.strong<StyledProps>`
  ${StyledCss}
`;
const Sub = styled.sub<StyledProps>`
  ${StyledCss}
`;
const Summary = styled.summary<StyledProps>`
  ${StyledCss}
`;
const Sup = styled.sup<StyledProps>`
  ${StyledCss}
`;
const Table = styled.table.attrs<StyledProps>({
  role: 'table',
})`
  display: block;
  ${StyledCss}
`;
const Tbody = styled.tbody.attrs<StyledProps>({
  role: 'rowgroup',
})`
  display: block;
  ${StyledCss}
`;
const Td = styled.td.attrs<StyledProps>({
  role: 'cell',
})`
  ${StyledCss}
`;
const Textarea = styled.textarea<StyledProps>`
  ${StyledCss}
`;
const Th = styled.th.attrs<StyledProps>({
  role: 'columnheader',
})`
  ${StyledCss}
`;
const Thead = styled.thead.attrs<StyledProps>({
  role: 'rowgroup',
})`
  display: block;
  ${StyledCss}
`;
const Title = styled.title<StyledProps>`
  ${StyledCss}
`;
const Tr = styled.tr.attrs<StyledProps>({
  role: 'row',
})`
  ${StyledCss}
`;
const U = styled.u<StyledProps>`
  ${StyledCss}
`;
const Ul = styled.ul<StyledProps>`
  ${StyledCss}
`;

export {
  A,
  Address,
  Aside,
  B,
  Blockquote,
  Body,
  Br,
  Button as StyledButton,
  Caption,
  Colgroup,
  Data,
  Datalist,
  Dd,
  Del,
  Details,
  Dialog,
  Div,
  Dl,
  Dt,
  Em,
  Fieldset as StyledFieldset,
  Footer as StyledFooter,
  Form,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Head,
  Header as StyledHeader,
  Hr,
  I,
  Iframe,
  Img,
  Input as StyledInput,
  Label as StyledLabel,
  Legend as StyledLegend,
  Li,
  Main,
  Menu as StyledMenu,
  Menuitem,
  Nav,
  Ol,
  Option,
  P,
  Section,
  Select as StyledSelect,
  Span,
  Strong,
  Sub,
  Summary,
  Sup,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Title,
  Tr,
  U,
  Ul,
};
