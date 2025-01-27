import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import personIcon from "../assets/person.png"
import personListIcon from "../assets/personlist.png"
import newIcon from "../assets/new.png"
import loadingIcon from "../assets/loading.png"
import checkIcon from "../assets/check.png"

export default function CfpSidePanel() {
  const [clientUuid] = useState(localStorage.getItem("clientUuid") || "")
  const navigate = useNavigate()
  const location = useLocation()

  const [clientFullName, setClientFullName] = useState(
    localStorage.getItem("clientFullName") || ""
  )
  const [clientFormatId, setClientFormatId] = useState(
    localStorage.getItem("clientFormatId") || ""
  )

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_KEY}api/clients/${clientUuid}`
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const clientData = await response.json()
        const fullName = `${clientData.clientFirstName} ${clientData.clientLastName}`
        const formatId = clientData.clientFormatId

        setClientFullName(fullName)
        setClientFormatId(formatId)

        // Update localStorage
        localStorage.setItem("clientFullName", fullName)
        localStorage.setItem("clientFormatId", formatId)
      } catch (error) {
        console.error("Error fetching client details:", error)
      }
    }

    fetchClientDetails()
  }, [clientUuid]) // Only re-run the effect when clientId changes

  const currentPath = location.pathname

  const menuItems = [
    {
      label: "ข้อมูลลูกค้า",
      icon: personListIcon,
      routes: [
        `/client-info/`,
        `/client-income/`,
        `/client-expense/`,
        `/client-asset/`,
        `/client-debt/`,
      ],
    },
    {
      label: "พอร์ตการลงทุน",
      icon: newIcon,
      routes: [`/portfolio-selection/`, `/portfolio-chart/`],
    },
    {
      label: "การคำนวณเป้าหมาย",
      icon: loadingIcon,
      routes: [
        `/goal-base/`,
        `/goal-base-calculated/`,
        `/goal-base-dashboard/`,
        `/retirement-goal/`,
        `/retirement-goal-calculated/`,
      ],
    },
    {
      label: "การวางแผนหลายเป้าหมาย",
      icon: checkIcon,
      routes: [`/cashflow-base/`, `/cashflow-base-calculated/`],
    },
    {
      label: "ตรวจสุขภาพทางการเงิน",
      icon: checkIcon,
      routes: [`/financial-healthcheck/`],
    },
    {
      label: "การคำนวณภาษี",
      icon: checkIcon,
      routes: [`/tax-income/`, `/tax-deduction/`, `/tax-calculation/`],
    },
  ]

  return (
    <div className="bg-tfpa_blue w-60 p-1 flex flex-col text-white">
      <div className="mb-3 mt-3 bg-tfpa_gold rounded-3xl p-2 flex items-center space-x-2">
        <img src={personIcon} alt="Person Icon" className="w-12 h-12" />
        <div className="flex flex-col">
          <div className="text-white text-sm mb-1 font-ibm font-bold">
            {clientFullName}
          </div>
          <div className="text-tfpa_blue text-sm font-ibm font-bold">
            {clientFormatId}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        {menuItems.map((item) => {
          const isActive = item.routes.some((route) =>
            currentPath.startsWith(route)
          )
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.routes[0])}
              className={`flex items-center space-x-2 px-2 py-2 rounded-2xl ${
                isActive
                  ? "bg-tfpa_blue_panel_select"
                  : "bg-tfpa_blue hover:bg-tfpa_blue_panel_select"
              } transition-colors duration-200 text-left`}
            >
              <img src={item.icon} alt={item.label} className="w-5 h-5" />
              <span className="text-sm font-medium font-ibm">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
