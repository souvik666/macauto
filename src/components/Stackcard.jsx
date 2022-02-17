import { Chip } from "@mui/material";
import styled from "styled-components";

const Cont = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1%;
`;

export default function Elevation(props) {
  const { Data } = props;
  //console.log(Data)
  /* <Chip label="primary" color="primary" />
        <Chip label="success" color="success" /> */
  // console.log(Data);
  return (
    <>
      <Cont>
        {Data.forEach((el) => {
          <Chip label={el} color="success" />;
        })}
      </Cont>
    </>
  );
}
