import { Auth, API } from "aws-amplify";

const apiGatewayCall = async (url, method, options = {}) => {
  return new Promise(async (resolve, reject) => {
    const jwt = await Auth.currentSession();
    const jwtToken = jwt.idToken.jwtToken;
    options.headers = {
      Authorization: jwtToken,
    };
    await API[method]("save-for-later-api", url, options)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
};

export default apiGatewayCall;