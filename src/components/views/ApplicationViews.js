import { Route, Outlet, Routes } from "react-router-dom"
import CNAPortal from "../portals/CNAPortal";
import RDPortal from "../portals/RDPortal";
import RNPortal from "../portals/RNPortal";


export const ApplicationViews = () => {
	return (
    <Routes>
      <Route path="/home" element={<Outlet />} />
      <Route path="/cnaportal" element={<CNAPortal />} />
      <Route path="/rdportal" element={<RDPortal />} />
      <Route path="/rnportal" element={<RNPortal />} />
    </Routes>
  );
}
