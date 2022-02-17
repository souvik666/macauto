import axios from "axios";
/*eslint no-undef: 0*/
function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

function extractEmails(text) {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
}
function extractPhone(text) {
  const trs = text.match(/[\\+]?\d{10}|\(\d{3}\)\s?-\d{6}/);
  if (!trs) {
    return;
  } else {
    return trs[0];
  }
}

function extractSocialMedia(text) {
  var urlRegex = /(https?:\/\/[^ ]*)/;
  return text.match(urlRegex).length !== 0;
}

const PinnedRepoWatchDog = (arr) => {
  const len = arr.length;
  //const fscty = arr.length / 100;
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
    if (!getProfileReadme(repo, owner)) obj.noReadME.push(link);
    if (website === undefined) {
      obj.NoDeployment.push(link);
    }
    if (description === undefined) {
      obj.NoGithubdesprition.push(link);
    }
    if (!image) {
      obj.noimg = true;
    }
  });
  const workdoneDE = percentage(len - obj.NoDeployment.length, len) | 0;
  const DES = percentage(len - obj.NoGithubdesprition.length - len) | 0;

  const [res, res2] = [workdoneDE || 100, DES || 100];
  return {
    description: res2 ,
    deployment: res ,
    no_deploymnet_Link_repos: obj.NoDeployment,
    no_description_repos: obj.NoGithubdesprition,
    no_ReadME_repo: obj.noReadME,
  };
};

export async function getPinnedRepo(user) {
  let response = await axios.get(
    `https://gh-pinned-repos.egoist.sh/?username=${user}`
  );
  return PinnedRepoWatchDog(response.data);
  //   return console.log("Pinned repo Cheking Done");
}
//getPinnedRepo();

async function getProfileReadme(reponame, owner) {
  try {
    let response = await axios.get(
      `https://raw.githubusercontent.com/${owner}/${reponame}/main/README.md`
    );
    return response.data.length > 300;
  } catch (e) {
    return "Opps" + e;
  }
}
/* getProfileReadme();
  getPinnedRepo(); */

/* Profile ReadME evaluation  */

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
