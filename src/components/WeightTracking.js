import { Route, Routes } from "react-router-dom"
import { Authorized } from "./views/Authorized"
import { ApplicationViews } from "./views/ApplicationViews"
import { Home } from "./home/Home"



export const WeightTracking = () => {
	return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="*"
        element={
          <Authorized>
            <>
              <ApplicationViews />
            </>
          </Authorized>
        }
      />
    </Routes>
  );
}

