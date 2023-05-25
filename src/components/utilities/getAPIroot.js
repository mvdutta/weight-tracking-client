export const getAPIroot = () => {
  const environment = process.env.NODE_ENV;
  const APIROOT =
    environment === "development" ? "http://localhost:8000/" : "thebackend";
  return APIROOT;
};
