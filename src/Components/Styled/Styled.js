import styled, { css } from 'styled-components';

const StyledCss = css`
  && {
    ${({ $css }) => $css && $css};
  }
`;

/**
 * All React supported tags, minus some of the unnecessary ones. https://react-cn.github.io/react/docs/tags-and-attributes.html
 */

const A = styled.a`
  ${StyledCss}
`;
const Address = styled.address`
  ${StyledCss}
`;
const Aside = styled.aside`
  ${StyledCss}
`;
const B = styled.b`
  ${StyledCss}
`;
const Blockquote = styled.blockquote`
  ${StyledCss}
`;
const Body = styled.body`
  ${StyledCss}
`;
const Br = styled.br`
  ${StyledCss}
`;
const Button = styled.button`
  ${StyledCss}
`;
const Caption = styled.caption`
  ${StyledCss}
`;
const Colgroup = styled.colgroup`
  ${StyledCss}
`;
const Data = styled.data`
  ${StyledCss}
`;
const Datalist = styled.datalist`
  ${StyledCss}
`;
const Dd = styled.dd`
  ${StyledCss}
`;
const Del = styled.del`
  ${StyledCss}
`;
const Details = styled.details`
  ${StyledCss}
`;
const Dialog = styled.dialog`
  ${StyledCss}
`;
const Div = styled.div`
  ${StyledCss}
`;
const Dl = styled.dl`
  ${StyledCss}
`;
const Dt = styled.dt`
  ${StyledCss}
`;
const Em = styled.em`
  ${StyledCss}
`;
const Fieldset = styled.fieldset`
  ${StyledCss}
`;
const Footer = styled.footer`
  ${StyledCss}
`;
const Form = styled.form`
  ${StyledCss}
`;
const H1 = styled.h1`
  ${StyledCss}
`;
const H2 = styled.h2`
  ${StyledCss}
`;
const H3 = styled.h3`
  ${StyledCss}
`;
const H4 = styled.h4`
  ${StyledCss}
`;
const H5 = styled.h5`
  ${StyledCss}
`;
const H6 = styled.h6`
  ${StyledCss}
`;
const Head = styled.head`
  ${StyledCss}
`;
const Header = styled.header`
  ${StyledCss}
`;
const Hr = styled.hr`
  ${StyledCss}
`;
const I = styled.i`
  ${StyledCss}
`;
const Iframe = styled.iframe`
  ${StyledCss}
`;
const Img = styled.img`
  ${StyledCss}
`;
const Input = styled.input`
  ${StyledCss}
`;
const Label = styled.label`
  ${StyledCss}
`;
const Legend = styled.legend`
  ${StyledCss}
`;
const Li = styled.li`
  ${StyledCss}
`;
const Main = styled.main`
  ${StyledCss}
`;
const Menu = styled.menu`
  ${StyledCss}
`;
const Menuitem = styled.menuitem`
  ${StyledCss}
`;
const Nav = styled.nav`
  ${StyledCss}
`;
const Ol = styled.ol`
  ${StyledCss}
`;
const Option = styled.option`
  ${StyledCss}
`;
const P = styled.p`
  ${StyledCss}
`;
const Section = styled.section`
  ${StyledCss}
`;
const Select = styled.select`
  ${StyledCss}
`;
const Span = styled.span`
  ${StyledCss}
`;
const Strong = styled.strong`
  ${StyledCss}
`;
const Sub = styled.sub`
  ${StyledCss}
`;
const Summary = styled.summary`
  ${StyledCss}
`;
const Sup = styled.sup`
  ${StyledCss}
`;
const Table = styled.table.attrs({
  role: 'table',
})`
  display: block;
  ${StyledCss}
`;
const Tbody = styled.tbody.attrs({
  role: 'rowgroup',
})`
  display: block;
  ${StyledCss}
`;
const Td = styled.td.attrs({
  role: 'cell',
})`
  ${StyledCss}
`;
const Textarea = styled.textarea`
  ${StyledCss}
`;
const Th = styled.th.attrs({
  role: 'columnheader',
})`
  ${StyledCss}
`;
const Thead = styled.thead.attrs({
  role: 'rowgroup',
})`
  display: block;
  ${StyledCss}
`;
const Title = styled.title`
  ${StyledCss}
`;
const Tr = styled.tr.attrs({
  role: 'row',
})`
  ${StyledCss}
`;
const U = styled.u`
  ${StyledCss}
`;
const Ul = styled.ul`
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
