export const formattedDate = (date) => {
  const myDate = date;
  let year = myDate.toLocaleString("default", { year: "numeric" });
  let month = myDate.toLocaleString("default", { month: "2-digit" });
  let day = myDate.toLocaleString("default", { day: "2-digit" });
  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
};

export const formattedDateMDY = (date) => {
  const myDate = date;
  let year = myDate.toLocaleString("default", { year: "numeric" });
  let month = myDate.toLocaleString("default", { month: "2-digit" });
  let day = myDate.toLocaleString("default", { day: "2-digit" });
  const formattedDateMDY = month + "-" + day + "-" + year;
  return formattedDateMDY;
};




export const formattedDateUI = (dateStr) => {
  if (!dateStr) return ""
  const [yy, mm, dd] = dateStr.split("-");
  if (!yy || !mm || !dd) return ""
  return mm + "-" + dd + "-" + yy;
};

