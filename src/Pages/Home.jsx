import { Alert, Chip } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { Chart } from "../components/Chart";
import SearchAppBar from "../components/Navbar";
import { device } from "../Device";
import { getPinnedRepo } from "../Helper/Helper";
import LinearProgress from "@mui/material/LinearProgress";

const openInNewTab = (url) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};
const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 95%;
  margin: auto;
  @media ${device.mobileS} {
    grid-template-columns: 1fr;
  }
  @media ${device.mobileM} {
    grid-template-columns: 1fr;
  }
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
  @media ${device.tablet} {
    grid-template-columns: 1fr 1fr;
  }
`;

const Charbox = styled.div`
  width: 70%;
  margin: auto;
`;
const InfoBox = styled.div`
  width: 80%;
  margin: auto;
`;
export default function Main() {
  // const [dvalue, setValue] = useState();

  const [visit, setvisit] = useState();
  const [chartdata, setchartdata] = useState();
  const [nodesArray, setnodesArr] = useState([]);
  const [nodescriptionArray, setnodescriptionArray] = useState([]);
  const [pass, setPass] = useState();
  const [flag, setflag] = useState();
  function GrabInput(value) {
    setvisit(true);
    setflag(true);
    getPinnedRepo(value)
      .then((d) => {
        //console.log(d);
        //setValue(d);

        const description = d.description;
        const deployment = d.deployment;
        const no_description_repos = d.no_description_repos.length || 100;
        const no_deploymnet_Link_repos = d.no_deploymnet_Link_repos;
        const pass_status = d.pass;
        setPass(pass_status);
        setnodesArr(no_deploymnet_Link_repos);
        setnodescriptionArray(d.no_description_repos);
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
        return setflag(false);
      })
      .catch((e) => {
        return console.log(e);
      });
    // console.log(dvalue.description);
  }

  return (
    <>
      {" "}
      <SearchAppBar GrabInput={GrabInput}></SearchAppBar>
      {flag ? <LinearProgress color="secondary" /> : ""}
      <br />
      <StyledDiv>
        <Charbox>
          {chartdata ? (
            <Chart dataset={chartdata}></Chart>
          ) : (
            <img alt="dragon" src="pixeldragon.jpg"></img>
          )}
        </Charbox>
        <InfoBox>
          {!visit ? (
            <h1>
              {" "}
              Hey Please Enter Your Github UserName On the search bar and click
              enter{" "}
            </h1>
          ) : (
            ""
          )}
          {pass ? (
            <Alert severity="success">Awsome work! Good to go!</Alert>
          ) : (
            ""
          )}
          {nodesArray.length && !pass ? (
            <Alert style={{ marginTop: "3%" }} severity="warning">Repos Which are not Deployed yet</Alert>
          ) : (
            ""
            /*  <h1>
              Please Enter Your Github User name on Searh Bar & click enter to
              Evaluate
            </h1> */
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
                  color="success"
                  onClick={(e) => {
                    openInNewTab(el);
                  }}
                ></Chip>
              </>
            );
          })}

          {nodescriptionArray.length ? (
            <Alert style={{ marginTop: "3%" }} severity="warning">
              Repos Which are not Descriptive
            </Alert>
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
                  color="success"
                  onClick={(e) => {
                    openInNewTab(el);
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
