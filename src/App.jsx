import { BrowserRouter, Route, Routes } from "react-router-dom"
import "@fontsource/ibm-plex-sans-thai"
import "@fontsource/prompt"
import ClientLogin from "./pages/client_login"
import PlannerLogin from "./pages/planner_login"
import LoginSelection from "./pages/login_selection"
import Register from "./pages/register"
import CfpHomepage from "./pages/cfp_homepage"
import ClientHomepage from "./pages/client_homepage"
import ClientAboutTFPA from "./pages/client_aboutTFPA"
import ClientPlanningImportance from "./pages/client_planningimportance"
import ClientFAQ from "./pages/client_faq"
import ClientPrecalculationPage from "./pages/client_precalculation_page"
import ClientHealthcheckPage from "./pages/client_healthcheck_page"
import ClientHealthcheckResult from "./pages/client_healthcheck_result"
import ClientEasygoalPage from "./pages/client_easygoal_page"
import ClientEasygoalResult from "./pages/client_easygoal_result"
import CFPProfile from "./pages/cfp_profile"
import PortfolioSelectionCFP from "./pages/portfolio_selection_cfp"
import PortfolioCreationCFP from "./pages/portfolio_creation_cfp"
import CFPCashflowBase from "./pages/cfp_cashflow_base"
import CFPCashflowBaseCalculated from "./pages/cfp_cashflow_base_calculated"
import CFPCashflowBaseDashboard from "./pages/cfp_cashflow_base_dashboard.jsx"
import CFPGoalBase from "./pages/cfp_goal_base"
import CFPGoalBaseCalculated from "./pages/cfp_goal_base_calculated"
import CFPGoalBaseDashboard from "./pages/cfp_goal_base_dashboard.jsx"
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
import RetirementGoalDashboard from "./pages/retirement-goal-dashboard.jsx"
import ClientMarketPlace from "./pages/client_marketplace"
import ClientInfo from "./pages/client_info.jsx"
import ClientStatusPage from "./pages/client_status.jsx"

export default function App() {
  return (
    <BrowserRouter basename={"/financial-planner/"}>
      <Routes>
        <Route path="/" element={<LoginSelection />} />
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/planner-login" element={<PlannerLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cfp-homepage/" element={<CfpHomepage />} />
        <Route path="/client-homepage" element={<ClientHomepage />} />
        <Route path="/client-planningimportance" element={<ClientPlanningImportance />} />
        <Route path="/client-aboutTFPA" element={<ClientAboutTFPA />} />
        <Route path="/client-faq" element={<ClientFAQ />} />
        <Route path="/client-marketplace" element={<ClientMarketPlace />} />
        <Route path="/client-information" element={<ClientInfo />} />
        <Route path="/client-status" element={<ClientStatusPage />} />
        <Route
          path="/client-precalculation-page"
          element={<ClientPrecalculationPage />}
        />
        <Route
          path="/client-healthcheck-page"
          element={<ClientHealthcheckPage />}
        />
        <Route
          path="/client-healthcheck-result"
          element={<ClientHealthcheckResult />}
        />
        <Route path="/client-easygoal-page" element={<ClientEasygoalPage />} />
        <Route
          path="/client-easygoal-result"
          element={<ClientEasygoalResult />}
        />
        <Route path="/cfp-profile/" element={<CFPProfile />} />
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
        <Route
          path="/cashflow-base-dashboard/"
          element={<CFPCashflowBaseDashboard />}
        />
        <Route path="/goal-base/" element={<CFPGoalBase />} />
        <Route
          path="/goal-base-calculated/"
          element={<CFPGoalBaseCalculated />}
        />
        <Route
          path="/goal-base-dashboard/"
          element={<CFPGoalBaseDashboard />}
        />
        <Route path="/retirement-goal/" element={<RetirementGoalPage />} />
        <Route
          path="/retirement-goal-calculated/"
          element={<RetirementGoalCalculated />}
        />
        <Route
          path="/retirement-goal-dashboard/"
          element={<RetirementGoalDashboard />}
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
    </BrowserRouter>
  )
}
