import { WeightTracking } from "./components/WeightTracking"
import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { NavBar } from "./components/nav/NavBar"

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <div>
        <WeightTracking />
        </div>
    </BrowserRouter>
)
