import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ClientLogin from "./pages/client_login"
import PlannerLogin from "./pages/planner_login"
import AdminLogin from "./pages/admin_login"
import LoginSelection from "./pages/login_selection"
import Register from "./pages/register"
import CfpHomepage from "./pages/cfp_homepage"
import PortfolioSelectionCFP from "./pages/portfolio_selection_cfp"
import PortfolioCreationCFP from "./pages/portfolio_creation_cfp"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSelection />} />
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/planner-login" element={<PlannerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cfp-homepage/:cfpId" element={<CfpHomepage />} />
        <Route
          path="/:cfpId/portfolio-selection/:clientId"
          element={<PortfolioSelectionCFP />}
        />
        <Route
          path="/:cfpId/portfolio-chart/:clientId"
          element={<PortfolioCreationCFP />}
        />
      </Routes>
    </Router>
  )
}

export default App
