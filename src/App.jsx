import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "@fontsource/ibm-plex-sans-thai"
import ClientLogin from "./pages/client_login"
import PlannerLogin from "./pages/planner_login"
import AdminLogin from "./pages/admin_login"
import LoginSelection from "./pages/login_selection"
import Register from "./pages/register"
import CfpHomepage from "./pages/cfp_homepage"
import PortfolioSelectionCFP from "./pages/portfolio_selection_cfp"
import PortfolioCreationCFP from "./pages/portfolio_creation_cfp"
import CFPCashflowBase from "./pages/cfp_cashflow_base"
import CFPCashflowBaseCalculated from "./pages/cfp_cashflow_base_calculated"
import CFPGoalBase from "./pages/cfp_goal_base"
import CFPGoalBaseCalculated from "./pages/cfp_goal_base_calculated"
import RetirementGoalPage from "./pages/retirement_goal"
import RetirementGoalCalculated from "./pages/retirement_goal_calculated"
import TaxIncomePage from "./pages/tax_income"
import TaxDeductionPage from "./pages/tax_deduction"
import TaxCalculationPage from "./pages/tax_calculation"
import CFPFinancialHealthCheck from "./pages/cfp_financial_healthcheck"
import CFPClientInfoPage from "./pages/cfp_client_info"
import CFPClientIncomePage from "./pages/cfp_client_income"
import CFPClientExpensePage from "./pages/cfp_client_expense"
import CFPClientAssetPage from "./pages/cfp_client_asset"
import CFPClientDebtPage from "./pages/cfp_client_debt"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSelection />} />
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/planner-login" element={<PlannerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cfp-homepage/" element={<CfpHomepage />} />
        <Route
          path="/portfolio-selection/"
          element={<PortfolioSelectionCFP />}
        />
        <Route path="/portfolio-chart/" element={<PortfolioCreationCFP />} />
        <Route path="/cashflow-base/" element={<CFPCashflowBase />} />
        <Route
          path="/cashflow-base-calculated/"
          element={<CFPCashflowBaseCalculated />}
        />
        <Route path="/goal-base/" element={<CFPGoalBase />} />
        <Route
          path="/goal-base-calculated/"
          element={<CFPGoalBaseCalculated />}
        />
        <Route path="/retirement-goal/" element={<RetirementGoalPage />} />
        <Route
          path="/retirement-goal-calculated/"
          element={<RetirementGoalCalculated />}
        />
        <Route path="/tax-income/" element={<TaxIncomePage />} />
        <Route path="/tax-deduction/" element={<TaxDeductionPage />} />
        <Route path="/tax-calculation/" element={<TaxCalculationPage />} />
        <Route
          path="/financial-healthcheck/"
          element={<CFPFinancialHealthCheck />}
        />
        <Route path="/client-info/" element={<CFPClientInfoPage />} />
        <Route path="/client-income/" element={<CFPClientIncomePage />} />
        <Route path="/client-expense/" element={<CFPClientExpensePage />} />
        <Route path="/client-asset/" element={<CFPClientAssetPage />} />
        <Route path="/client-debt/" element={<CFPClientDebtPage />} />
      </Routes>
    </Router>
  )
}

export default App
