import { useNavigate, useLocation } from "react-router-dom"

import personIcon from "../assets/person.png"
import personListIcon from "../assets/personlist.png"

export default function CfpClientSidePanel() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = location.pathname

  const menuItems = [
    {
      label: "รายชื่อลูกค้า",
      icon: personListIcon,
      routes: [`/cfp-homepage/`],
    },
    {
      label: "โปรไฟล์ CFP",
      icon: personIcon,
      routes: [`/cfp-profile/`],
    },
  ]

  return (
    <div className="bg-tfpa_blue w-60 p-1 flex flex-col text-white">
      <div className="flex flex-col mt-5 space-y-2">
        {menuItems.map((item) => {
          const isActive = item.routes.some((route) =>
            currentPath.startsWith(route)
          )
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.routes[0])}
              className={`flex items-center space-x-2 px-3 py-3 rounded-2xl ${
                isActive
                  ? "bg-tfpa_blue_panel_select"
                  : "bg-tfpa_blue hover:bg-tfpa_blue_panel_select"
              } transition-colors duration-200 text-left`}
            >
              <img src={item.icon} alt={item.label} className="w-7 h-7" />
              <span className="text-base font-medium font-ibm">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
