let config = {};

config.quillModules = {
  toolbar: [["bold", "italic", "link"]],
};

switch (process.env.NODE_ENV) {
  case "development":
    config.apiRoot = "http://localhost:3001/";
    break;

  case "production":
    config.apiRoot = "https://ev82qway9k.execute-api.eu-west-2.amazonaws.com/v1/";
    break;

  default:
    break;
}

export default config;
