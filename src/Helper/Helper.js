import { Link } from "@mui/material";
import axios from "axios";

/*eslint no-undef: 0*/
export function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}
function extractEmails(text) {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
}
let count = 0;
function extractPhone(text) {
  const trs = text.match(/[\\+]?\d{10}|\(\d{3}\)\s?-\d{6}/);
  if (!trs) {
    return;
  } else {
    return trs[0];
  }
}

function checker(str) {
  return (
    str.split(".").includes("vercel") ||
    str.split(".").includes("netlify") ||
    str.split(".").includes("herokuapp") ||
    str.split(".").includes("github") ||
    str.split(".").includes("000webhostapp")
  );
}

function extractSocialMedia(text) {
  var urlRegex = /(https?:\/\/[^ ]*)/;
  return text.match(urlRegex).length !== 0;
}

const PinnedRepoWatchDog = (arr) => {
  const len = arr.length;
  //const fscty = arr.length / 100;
  window.localStorage.removeItem("ReadME");

  let you = [];
  const obj = {
    NoDeployment: [],
    NoGithubdesprition: [],
    noimg: false,
    noReadME: [],
  };

  arr.forEach((element) => {
    const {
      owner,
      repo,
      link,
      description,
      image,
      /*  language,
      languageColor,
      stars,
      forks, */
      website,
    } = element;

    //console.log(tmp);
    getProfileReadme(repo, owner).then((d) => {
      if (!d) {
        count++;
        obj.noReadME.push(link);
      }
    });
    you.push(Link);

    //if (!getProfileReadme(repo, owner)) obj.noReadME.push(link);
    if (website === undefined) {
      obj.NoDeployment.push(link);
    } else if (website) {
      console.log(website);
      if (!checker(website)) {
        console.log(website);
        obj.NoDeployment.push(link);
      }
    }
    if (description === undefined) {
      obj.NoGithubdesprition.push(link);
    } else {
      if (description.length <= 50) {
        obj.NoGithubdesprition.push(link);
      }
    }

    if (!image) {
      obj.noimg = true;
    }
  });
  const workdoneDE = percentage(len - obj.NoDeployment.length, len) | 0;
  const DES = percentage(len - obj.NoGithubdesprition.length, len) | 0;
  const [res, res2] = [workdoneDE || 100, DES || 100];
  //console.log(noReadme);
  // console.log(you);
  setTimeout(function () {
    window.localStorage.setItem("ReadME", JSON.stringify(obj.noReadME));
    helpmetoAppend(obj.noReadME);
  }, 1000);
  //window.document.getElementById("noredme").innerHTML = "ji";
  //console.log(arr.length);
  return {
    d: arr,
    redmenocount: count,
    no_readME: obj.noReadME,
    description: res2,
    deployment: res,
    repocount: len,
    no_deploymnet_Link_repos: obj.NoDeployment,
    no_description_repos: obj.NoGithubdesprition,
    no_ReadME_repo: obj.noReadME,
    pass:
      !obj.noReadME.length &&
      !obj.NoDeployment.length &&
      !obj.NoGithubdesprition.length,
  };
};
async function getProfileReadme(reponame, owner) {
  try {
    let response = await axios.get(
      `https://raw.githubusercontent.com/${owner}/${reponame}/main/README.md`
    );

    return response.data.length > 300;
  } catch (e) {
    if (e) console.log("trying master branch...");
    let responsetwo = await axios.get(
      `https://raw.githubusercontent.com/${owner}/${reponame}/master/README.md`
    );
    return responsetwo.data.length > 300;
  }
}
export async function getPinnedRepo(user) {
  let response = await axios.get(
    `https://gh-pinned-repos.egoist.sh/?username=${user}`
  );

  return PinnedRepoWatchDog(response.data);
  //   return console.log("Pinned repo Cheking Done");
}
//getPinnedRepo();

/* Profile ReadME evaluation  */
const openInNewTab = (url) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};
export async function getUserProfileState(owner, reponame) {
  let res = {
    email: true,
    phone: true,
    socilaLink: true,
    PhoneEmail: [],
  };
  let response = await axios.get(
    `https://raw.githubusercontent.com/${owner}/${reponame}/main/README.md`
  );
  if (!extractSocialMedia(response.data)) {
    res.socilaLink = false;
  }
  if (!extractEmails(response.data)) {
    res.email = false;
  } else {
    res.PhoneEmail.push(extractEmails(response.data));
  }
  if (!extractPhone(response.data)) {
    res.phone = false;
  } else {
    res.PhoneEmail.push(extractPhone(response.data));
  }
  return console.log(res);
}

function helpmetoAppend(d) {
  const target = window.document.getElementById("noredme");
  // const target2 = window.document.getElementById("msgred");
  target.innerHTML = "";
  d.map((el, i) => {
    let tmp = el.split("//");
    let protmp = tmp[1].split("/");

    let div = document.createElement("div");
    let box = document.createElement("button");
    box.innerHTML = protmp[protmp.length - 1];
    box.style = `
    border-radius: 17px;
    background: rgb(54,124,49);
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 2%;
    color:  white;
    border:0px
    
`;
    box.addEventListener("click", () => {
      openInNewTab(el);
    });
    div.append(box);
    return target.append(div);
  });
}
