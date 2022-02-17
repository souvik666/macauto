import { Chip } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { Chart } from "../components/Chart";
import SearchAppBar from "../components/Navbar";
import { getPinnedRepo } from "../Helper/Helper";

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 95%;
  margin: auto;
`;

const Charbox = styled.div`
  width: 70%;
`;
const InfoBox = styled.div``;
export default function Main() {
  // const [dvalue, setValue] = useState();

  const [chartdata, setchartdata] = useState();
  const [nodesArray, setnodesArr] = useState([]);
  const [nodescriptionArray, setnodescriptionArray] = useState([]);
  function GrabInput(value) {
    getPinnedRepo(value)
      .then((d) => {
        //console.log(d);
        //setValue(d);
        const description = d.description;
        const deployment = d.deployment;
        const no_description_repos = d.no_description_repos.length || 100;
        const no_deploymnet_Link_repos = d.no_deploymnet_Link_repos;
        setnodesArr(no_deploymnet_Link_repos);
        setnodescriptionArray(d.no_description_repos);
        //console.log(nodesArray);
        //console.log(description, deployment, no_description_repos);
        setchartdata({
          labels: [
            "Repo with description",
            "deployment done",
            "no_description_repos",
          ],
          datasets: [
            {
              label: "Work Done By you in percentage",
              data: [description, deployment, no_description_repos],
              backgroundColor: [
                "#63ff7d",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                /*                 "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)", */
              ],
              borderColor: [
                "#5e6df530",
                "#36a3eb52",
                "#ffcf5626",
                /* "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)", */
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((e) => {
        console.log(e);
      });
    // console.log(dvalue.description);
  }

  return (
    <>
      {" "}
      <SearchAppBar GrabInput={GrabInput}></SearchAppBar>
      <br />
      <StyledDiv>
        <Charbox>
          {chartdata ? (
            <Chart dataset={chartdata}></Chart>
          ) : (
            <img alt ="dragon" src="pixeldragon.jpg"></img>
          )}
        </Charbox>
        <InfoBox>
          {nodesArray.length ? (
            <h1>Repos Which are not Deployed yet</h1>
          ) : (
            <h1>
              Please Enter Your Github User name on Searh Bar & click enter to
              Evaluate
            </h1>
          )}

          {nodesArray.map((el, i) => {
            let tmp = el.split("//");
            let protmp = tmp[1].split("/");
            //console.log(protmp[protmp.length - 1], el);
            return (
              <>
                <Chip
                  style={{ marginTop: "2%", marginRight: "2%" }}
                  id={i}
                  label={protmp[protmp.length - 1]}
                  color="warning"
                  onClick={(e) => {
                    window.location.href = el;
                  }}
                ></Chip>
              </>
            );
          })}

          {nodescriptionArray.length ? (
            <h1>Repos Which are not Descriptive</h1>
          ) : (
            ""
          )}

          {nodescriptionArray.map((el, i) => {
            let tmp = el.split("//");
            let protmp = tmp[1].split("/");
            //console.log(protmp[protmp.length - 1], el);
            return (
              <>
                <Chip
                  key={i}
                  style={{ marginTop: "2%", marginRight: "2%" }}
                  id={i}
                  label={protmp[protmp.length - 1]}
                  color="warning"
                  onClick={(e) => {
                    window.open = el;
                  }}
                ></Chip>
              </>
            );
          })}
        </InfoBox>
      </StyledDiv>
    </>
  );
}
