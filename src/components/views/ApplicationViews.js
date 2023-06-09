import { Route, Outlet, Routes } from "react-router-dom";
import { CensusList } from "../census/CensusList";
import Inbox from "../messages/Inbox";
import WeeklySheet from "../weightSheets/WeeklySheet";
import WeightSummary from "../weightSheets/WeightSummary";
import CNAdashboard from "../dashboard/CNAdashboard";
import RDdashboard from "../dashboard/RDdashboard";
import RNdashboard from "../dashboard/RNdashboard";
import { NoAccess } from "../NoAccess";
import Compose from "../messages/Compose";
import WeightSheetSummary from "../weightSheets/WeightSheetSummary";
import MessageDetailModal from "../messages/MessageDetailModal";

export const ApplicationViews = () => {
  return (
    <Routes>
      <Route path="/home" element={<Outlet />} />
      <Route path="/cnadashboard" element={<CNAdashboard />} />
      <Route path="/rddashboard" element={<RDdashboard />} />
      <Route path="/rndashboard" element={<RNdashboard />} />
      <Route path="/weeklysheet/:date" element={<WeeklySheet />} />
      <Route path="/inbox" element={<Inbox />} />
      <Route path="/censuslist" element={<CensusList />} />
      <Route path="/weightsummary/:date" element={<WeightSummary />} />
      <Route path="/noaccess" element={<NoAccess />} />
      <Route path="/compose" element={<Compose />} />
      <Route path="/messagedetail/:id" element={<MessageDetailModal />} />
      <Route
        path="/weightsheetsummary/:date"
        element={<WeightSheetSummary />}
      />
    </Routes>
  );
};
