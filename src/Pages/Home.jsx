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

  const [visit, setvisit] = useState(false);
  const [chartdata, setchartdata] = useState();
  const [nodesArray, setnodesArr] = useState([]);
  const [nodescriptionArray, setnodescriptionArray] = useState([]);
  const [validse, setvalidse] = useState(false);
  const [pass, setPass] = useState();
  const [flag, setflag] = useState();
  const [infopass, setinfopass] = useState();
  const [legint, setlegit] = useState(true);
  const [repoin, setrepopin] = useState(true);
  const [userdata, setUserdata] = useState({
    portfoliourl: "",
    twitter_username: "",
    bio: "",
    blog: "",
    status: 0,
    location: "",
    img: "",
    name: "",
  });
  const [red, setred] = useState();
  const [see, setsee] = useState();
  function GrabInput(value) {
    setlegit(true);
    setrepopin(true);
    /* */ (async function () {
      axios
        .get(
          `https://raw.githubusercontent.com/${value}/${value}/main/README.md`
        )
        .then((d) => {
          if (d) {
            setlegit(true);
          }
        })
        .catch((e) => {
          if (e) {
            console.log("This Guys is So lazy" + e);
            setlegit(false);
          }
        });
    })();

    (async function () {
      setPass(false);
      axios
        .get(`https://api.github.com/users/${value}`)
        .then((d) => {
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
        })
        .catch((e) => {
          console.log("User Not Found" + e);
          setvalidse(true);
        });
    })();
    setvalidse(false);
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
        setrepopin(false);
        console.log("myerror" + e);
        return setflag(false);
      });
  }
  function eventme(value) {
    return setTimeout(function () {
      GrabInput(value);
    }, 1000);
  }

  return (
    <>
      <Normcont>
        <SearchAppBar GrabInput={eventme}></SearchAppBar>
        {flag ? <LinearProgress color="success" /> : ""}
        {validse ? (
          <Alert style={{ marginTop: "0.03%" }} severity="warning">
            User Not Found
          </Alert>
        ) : (
          ""
        )}
        {!legint ? (
          <Alert style={{ marginTop: "0.03%" }} severity="warning">
            No Profile Readme Found For This Student
          </Alert>
        ) : (
          ""
        )}

        {!repoin ? (
          <Alert style={{ marginTop: "0.03%" }} severity="warning">
            No Pinned Repo Found For This Student
          </Alert>
        ) : (
          ""
        )}
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
                Repos Which are not Deployed yet (forked repos and profile redme
                are not considerd)
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
                Repos Which are not Descriptive (min word count 50)
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
                  Repos Without ReadME (min word count 300)
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
        Made With ?????? By{" "}
        <a href="https://github.com/souvik666" target="_blank" rel="noreferrer">
          Souvik
        </a>{" "}
      </MyFooter>
    </>
  );
}
