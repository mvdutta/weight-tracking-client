export const formattedDate = (date) => {
  const myDate = date;
  let year = myDate.toLocaleString("default", { year: "numeric" });
  let month = myDate.toLocaleString("default", { month: "2-digit" });
  let day = myDate.toLocaleString("default", { day: "2-digit" });
  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
};




export const formattedDateUI = (date) => {
  const [yy, mm, dd] = date.split("-");
  return mm + "-" + dd + "-" + yy;
};