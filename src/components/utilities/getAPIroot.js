export const getAPIroot = () => {
  const environment = process.env.NODE_ENV;
  const APIROOT =
    environment === "development"
      ? "http://localhost:8000/"
      : "https://weighttracker-api.onrender.com/";
    // const APIROOT = "https://weighttracker-api.onrender.com/";
  return APIROOT;
};
