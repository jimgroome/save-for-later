import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import config from "./config";

import Amplify from "aws-amplify";
Amplify.configure({
  Auth: {
    region: "eu-west-2",
    userPoolId: "eu-west-2_8FiIrOWHd",
    userPoolWebClientId: "25jgrbm472lbt7s34a08t4vbm",
    mandatorySignIn: false,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
  API: {
    endpoints: [
      {
        name: "save-for-later-api",
        endpoint: config.apiRoot,
        region: "eu-west-2",
      },
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
// serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
