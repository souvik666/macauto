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
  gap: 1%;
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
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px; /* Height of the footer */
  background: #6cf;
  line-height: 4;
  background-color: black;
  color: white;
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
  margin-bottom: 25%;
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
  const [pass, setPass] = useState(false);
  const [flag, setflag] = useState();
  const [infopass, setinfopass] = useState();
  //console.log(visit)
  // const [t, sett] = useState();
  const [userdata, setUserdata] = useState({
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
          data.blog &&
          data.twitter_username &&
          data.bio &&
          data.location &&
          data.avatar_url
        ) {
          setinfopass(true);
        }
        setUserdata({
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
        const deployment = d.deployment;

        const no_deploymnet_Link_repos = d.no_deploymnet_Link_repos;
        const pass_status = d.pass;

        setPass(pass_status);
        setnodesArr(no_deploymnet_Link_repos);
        setnodescriptionArray(d.no_description_repos);

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

          setred(percentage(d.d.length - tmp.length, d.d.length) | 0);
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

        return setflag(false);
      })
      .catch((e) => {
        return console.log(e);
      });
  }
  function eventme(value) {
    return setTimeout(function () {
      GrabInput(value);
      console.log(userdata);
    }, 1000);
  }

  return (
    <>
      <Normcont>
        <SearchAppBar GrabInput={eventme}></SearchAppBar>
        {flag ? <LinearProgress color="success" /> : ""}

        <br />
        <StyledDiv>
          <Charbox>
            {chartdata && red ? (
              <Chart dataset={chartdata}></Chart>
            ) : (
              <img
                width={"100%"}
                alt="full stack souvik dutta"
                src="octocat.gif"
              ></img>
            )}
          </Charbox>
          <InfoBox>
            {!visit ? (
              <h1>
                {" "}
                Hey Please Enter Your Github UserName On the search bar and
                click enter{" "}
              </h1>
            ) : (
              ""
            )}
            {pass && infopass ? (
              <Alert severity="success" style={{ marginBottom: "3%" }}>
                Awsome work! Good to go!
              </Alert>
            ) : (
              ""
            )}

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
            )}

            {nodesArray.map((el, i) => {
              let tmp = el.split("//");
              let protmp = tmp[1].split("/");

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
      </Normcont>
      <MyFooter>
        Made With ❤️ By <a href="https://github.com/souvik666">Souvik</a>{" "}
      </MyFooter>
    </>
  );
}
