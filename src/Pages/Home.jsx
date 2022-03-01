import { Alert, Chip } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { Chart } from "../components/Chart";
import SearchAppBar from "../components/Navbar";
import { device } from "../Device";
import { getPinnedRepo, percentage } from "../Helper/Helper";
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
  window.localStorage.clear();
  /* const [dvalue, setValue] = useState([]);
  const [repocount, setrepocount] = useState(); */
  const [visit, setvisit] = useState(false);
  const [chartdata, setchartdata] = useState();
  const [nodesArray, setnodesArr] = useState([]);
  const [nodescriptionArray, setnodescriptionArray] = useState([]);
  // const [noReadME, setNoReadME] = useState([]);
  const [pass, setPass] = useState();
  const [flag, setflag] = useState();
  //console.log(visit)
  // const [t, sett] = useState();
  const [red, setred] = useState();
  const [see, setsee] = useState();
  function GrabInput(value) {
    setvisit(true);
    setflag(true);
    getPinnedRepo(value)
      .then((d) => {
        // setValue(d);
        //setrepocount(d.repocount);
        // const description = d.description;
        const deployment = d.deployment;
        //const no_description_repos = d.no_description_repos.length;
        const no_deploymnet_Link_repos = d.no_deploymnet_Link_repos;
        const pass_status = d.pass;
        //const NoReadME = d.no_ReadME_repo;

        setPass(pass_status);
        //  setNoReadME(NoReadME);
        setnodesArr(no_deploymnet_Link_repos);
        setnodescriptionArray(d.no_description_repos);

        /* console.log(window.localStorage.getItem("ReadMe")); */

        setTimeout(function () {
          let tmp = JSON.parse(window.localStorage.getItem("ReadME"));
          if (tmp) {
            if (tmp.length === 0) setsee(false);
            else setsee(true);
            if (percentage(d.d.length - tmp.length, d.d.length) | 0) {
              setred(percentage(d.d.length - tmp.length, d.d.length) | 0);
              if (percentage(d.d.length - tmp.length, d.d.length) < 99) {
                setPass(false);
              }
            }
          }
          // console.log(d.d.length);
          setred(percentage(d.d.length - tmp.length, d.d.length) | 0);
          //  sett(true);
          setchartdata({
            labels: [
              "Repos With ReadME",
              "deployment done",
              "Repo with_description_repos",
            ],
            datasets: [
              {
                label: "Work Done By you in percentage",
                data: [
                  percentage(d.d.length - tmp.length, d.d.length) | 0,
                  deployment,
                  percentage(
                    d.d.length - d.no_description_repos.length,
                    d.d.length
                  ) | 0,
                ],
                backgroundColor: [
                  "#63ff7d",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                ],
                borderColor: ["#5e6df530", "#36a3eb52", "#ffcf5626"],
                borderWidth: 3,
              },
            ],
          });
        }, 1000);
        //console.log(noReadME);
        return setflag(false);
      })
      .catch((e) => {
        return console.log(e);
      });
    // console.log(dvalue.description);
  }
  function eventme(value) {
    return setTimeout(function () {
      /* let noReadme = JSON.parse(window.localStorage.getItem("ReadME")) || [];
      setNoReadME(noReadme); */
      GrabInput(value);
      /*  if (noReadME.length > 0) {
        console.log(percentage(repocount - noReadME.length, repocount));
        console.log(repocount, noReadME.length);
      } */
    }, 1000);
  }

  return (
    <>
      {/* {t ? <p>Hi</p> : ""} */}
      {/*       {red ? <p>Hi</p> : <h1>Hi</h1>}{" "} */}
      <SearchAppBar GrabInput={eventme}></SearchAppBar>
      {flag ? <LinearProgress color="secondary" /> : ""}
      <br />
      <StyledDiv>
        <Charbox>
          {chartdata && red ? (
            <Chart dataset={chartdata}></Chart>
          ) : (
            <img width={"100%"} alt="dragon" src="pixeldragon.jpg"></img>
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

          {/* {noReadME.length ? (
            <Alert style={{ marginTop: "3%" }} severity="warning">
              Repos without README
            </Alert>
          ) : (
            ""
          )} */}

          {nodesArray.length && !pass ? (
            <Alert style={{ marginTop: "3%" }} severity="warning">
              Repos Which are not Deployed yet
            </Alert>
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
                  key={i}
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
          {
            /* document.getElementById("noredme") !== null */ see && !pass ? (
              <Alert style={{ marginTop: "3%" }} severity="warning">
                Repos Without ReadME
              </Alert>
            ) : (
              ""
            )
          }
          <div id="noredme"></div>
        </InfoBox>
      </StyledDiv>
    </>
  );
}
