import { Alert, Chip } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { Chart } from "../components/Chart";
import SearchAppBar from "../components/Navbar";
import { device } from "../Device";
import { getPinnedRepo, percentage } from "../Helper/Helper";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import OutlinedCard from "../components/Static.info";

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
const MyFooter = styled.footer`
  /*   height: 60px;
  text-align: center;
  background-color: black;
  color: white;
  margin-top: 2%;
  line-height: 4;
   */
  position: relative;
  bottom: -10;
  width: 100%;
  height: 60px; /* Height of the footer */
  background: #6cf;
  line-height: 4;
  background-color: black;
  color: white;
  margin-top: 13%;
  text-align: center;
`;
const Charbox = styled.div`
  width: 70%;
  margin: auto;
`;
const InfoBox = styled.div`
  width: 80%;
  margin: auto;
`;

const Normcont = styled.div`
  height: 100%;
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
  const [userdata, setUserdata] = useState({
    email: "",
    portfoliourl: "",
    twitter_username: "",
    bio: "",
    blog: "",
    status: "",
    location: "",
    img: "",
    name: "",
  });
  const [red, setred] = useState();
  const [see, setsee] = useState();
  function GrabInput(value) {
    (async function () {
      axios.get(`https://api.github.com/users/${value}`).then((d) => {
        let data = d.data;
        let status = d.status;
        if (
          !data.email ||
          !data.blog ||
          !data.twitter_username ||
          !data.bio ||
          !data.location ||
          !data.avatar_url
        ) {
          setPass(false);
        }
        setUserdata({
          email: data.email,
          portfoliourl: data.blog,
          twitter_username: data.twitter_username,
          bio: data.bio,
          location: data.location,
          img: data.avatar_url,
          status: status,
          name: data.name,
        });
      });
    })();
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
    <Normcont>
      {/* {t ? <p>Hi</p> : ""} */}
      {/*       {red ? <p>Hi</p> : <h1>Hi</h1>}{" "} */}
      <SearchAppBar GrabInput={eventme}></SearchAppBar>
      {flag ? <LinearProgress color="success" /> : ""}

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

          {chartdata && red ? (
            <OutlinedCard
              name={userdata.name}
              bio={userdata.bio}
              blog={userdata.portfoliourl}
              twitter_username={userdata.twitter_username}
              location={userdata.location}
              img={userdata.img}
            />
          ) : (
            ""
          )}

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
      <MyFooter>
        Made With ❤️ By <a href="https://github.com/souvik666">Souvik</a>{" "}
      </MyFooter>
    </Normcont>
  );
}
