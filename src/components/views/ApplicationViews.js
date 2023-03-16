import { Route, Outlet, Routes } from "react-router-dom"
import { CensusList } from "../census/CensusList";
import Inbox from "../messages/Inbox";
import CNAPortal from "../portals/CNAPortal";
import RDPortal from "../portals/RDPortal";
import RNPortal from "../portals/RNPortal";
import WeeklySheet from "../weightSheets/WeeklySheet";
import WeightSummary from "../weightSheets/WeightSummary";


export const ApplicationViews = () => {
	return (
    <Routes>
      <Route path="/home" element={<Outlet />} />
      <Route path="/cnaportal" element={<CNAPortal />} />
      <Route path="/rdportal" element={<RDPortal />} />
      <Route path="/rnportal" element={<RNPortal />} />
      <Route path="/weeklysheet" element={<WeeklySheet />} />
      <Route path="/inbox" element={<Inbox />} />
      <Route path="/censuslist" element={<CensusList />} />
      <Route path="/weightsummary" element={<WeightSummary />} />
    </Routes>
  );
}
