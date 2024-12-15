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
        <Route path="/cfp-homepage/:cfpId" element={<CfpHomepage />} />
        <Route
          path="/:cfpId/portfolio-selection/:clientId"
          element={<PortfolioSelectionCFP />}
        />
        <Route
          path="/:cfpId/portfolio-chart/:clientId"
          element={<PortfolioCreationCFP />}
        />
        <Route
          path="/:cfpId/cashflow-base/:clientId"
          element={<CFPCashflowBase />}
        />
        <Route
          path="/:cfpId/cashflow-base-calculated/:clientId"
          element={<CFPCashflowBaseCalculated />}
        />
        <Route path="/:cfpId/goal-base/:clientId" element={<CFPGoalBase />} />
        <Route
          path="/:cfpId/goal-base-calculated/:clientId"
          element={<CFPGoalBaseCalculated />}
        />
        <Route
          path="/:cfpId/retirement-goal/:clientId"
          element={<RetirementGoalPage />}
        />
        <Route
          path="/:cfpId/retirement-goal-calculated/:clientId"
          element={<RetirementGoalCalculated />}
        />
        <Route
          path="/:cfpId/tax-income/:clientId"
          element={<TaxIncomePage />}
        />
        <Route
          path="/:cfpId/tax-deduction/:clientId"
          element={<TaxDeductionPage />}
        />
        <Route
          path="/:cfpId/tax-calculation/:clientId"
          element={<TaxCalculationPage />}
        />
        <Route
          path="/:cfpId/financial-healthcheck/:clientId"
          element={<CFPFinancialHealthCheck />}
        />
        <Route
          path="/:cfpId/client-info/:clientId"
          element={<CFPClientInfoPage />}
        />
        <Route
          path="/:cfpId/client-income/:clientId"
          element={<CFPClientIncomePage />}
        />
        <Route
          path="/:cfpId/client-expense/:clientId"
          element={<CFPClientExpensePage />}
        />
        <Route
          path="/:cfpId/client-asset/:clientId"
          element={<CFPClientAssetPage />}
        />
        <Route
          path="/:cfpId/client-debt/:clientId"
          element={<CFPClientDebtPage />}
        />
      </Routes>
    </Router>
  )
}

export default App
