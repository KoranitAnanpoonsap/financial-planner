import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"

import personIcon from "../assets/person.png"
import personListIcon from "../assets/personlist.png"
import newIcon from "../assets/new.png"
import loadingIcon from "../assets/loading.png"
import checkIcon from "../assets/check.png"

export default function ClientBluePanel() {
  const { clientId } = useParams()
  const { cfpId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [clientFullName, setClientFullName] = useState("")
  const [clientFormatId, setClientFormatId] = useState("")

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/clients/${clientId}`
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const clientData = await response.json()
        setClientFullName(
          `${clientData.clientFirstName} ${clientData.clientLastName}`
        )
        setClientFormatId(clientData.clientFormatId)
      } catch (error) {
        console.error("Error fetching client details:", error)
      }
    }

    fetchClientDetails()
  }, [clientId])

  // Define menu items with multiple routes per item if needed
  const menuItems = [
    {
      label: "ข้อมูลลูกค้า",
      icon: personListIcon,
      // Suppose these pages also count as "client-info" pages
      routes: [`/${cfpId}/client-info/${clientId}`],
    },
    {
      label: "พอร์ตการลงทุน",
      icon: newIcon,
      routes: [
        `/${cfpId}/portfolio-selection/${clientId}`,
        `/${cfpId}/portfolio-chart/${clientId}`, // highlight also on chart page
      ],
    },
    {
      label: "การวางแผนเป้าหมายเดียว",
      icon: loadingIcon,
      routes: [
        `/${cfpId}/goal-base/${clientId}`,
        `/${cfpId}/goal-base-calculated/${clientId}`,
        `/${cfpId}/retirement-goal/${clientId}`,
        `/${cfpId}/retirement-goal-calculated/${clientId}`,
      ],
    },
    {
      label: "การวางแผนหลายเป้าหมาย",
      icon: checkIcon,
      routes: [
        `/${cfpId}/cashflow-base/${clientId}`,
        `/${cfpId}/cashflow-base-calculated/${clientId}`, // also highlight on calculated page
      ],
    },
    {
      label: "ตรวจสุขภาพทางการเงิน",
      icon: checkIcon,
      routes: [`/${cfpId}/financial-health-check/${clientId}`],
    },
    {
      label: "การคำนวณภาษี",
      icon: checkIcon,
      routes: [`/${cfpId}/tax/${clientId}`],
    },
  ]

  const currentPath = location.pathname

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
      {/* Menu items */}
      <div className="flex flex-col space-y-2">
        {menuItems.map((item) => {
          // Check if currentPath starts with or includes any route in item.routes
          const isActive = item.routes.some((route) =>
            currentPath.startsWith(route)
          )
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.routes[0])} // navigate to the first route in the array
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
