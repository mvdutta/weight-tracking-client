export const getAPIroot = () => {
  const environment = process.env.NODE_ENV;
  const APIROOT =
    environment === "development"
      ? "http://localhost:8000/"
      : "https://q72y0iroi2.execute-api.us-west-2.amazonaws.com/";
    // const APIROOT = "https://q72y0iroi2.execute-api.us-west-2.amazonaws.com/";
  return APIROOT;
};
