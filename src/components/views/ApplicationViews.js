import { Route, Outlet, Routes } from "react-router-dom"


export const ApplicationViews = () => {
	return (
    <Routes>
      <Route path="/home" element={<Outlet />} />
    </Routes>
  );
}
