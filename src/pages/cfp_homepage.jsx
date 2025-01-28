import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpSidePanel from "../components/cfpSidePanel.jsx"
import { format, parseISO } from "date-fns"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Listbox } from "@headlessui/react"
import { motion } from "framer-motion"

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 1 },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
}

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [currentPage, setCurrentPage] = useState(0) // Zero-indexed
  const [clientsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [sortOrder, setSortOrder] = useState("desc") // "asc" or "desc"
  const [sortBy, setSortBy] = useState("clientStartDate") // Default sort by clientStartDate
  const [totalPages, setTotalPages] = useState(0)
  const navigate = useNavigate()

  const [cfpUuid] = useState(localStorage.getItem("cfpUuid") || "")

  const fetchClients = async () => {
    if (!cfpUuid) {
      console.error("CFP UUID is not found in local storage")
      return
    }

    try {
      const params = new URLSearchParams()
      params.append("page", currentPage)
      params.append("size", clientsPerPage)
      if (searchQuery) {
        params.append("search", searchQuery)
      }
      if (filterStatus) {
        params.append("filterStatus", filterStatus)
      }
      params.append("sortBy", sortBy)
      params.append("sortDir", sortOrder)

      const response = await fetch(
        `${
          import.meta.env.VITE_API_KEY
        }api/clients/cfp-uuid/${cfpUuid}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setClients(data.clients)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [currentPage, searchQuery, filterStatus, sortOrder, sortBy])

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const handleClientInfo = (clientUuid, clientId) => {
    localStorage.setItem("clientUuid", clientUuid)
    localStorage.setItem("clientId", clientId)
    navigate(`/client-info/`)
  }

  const handleDelete = async (clientUuid) => {
    // Removed confirmation prompt as per requirement
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clients/dissociate/${clientUuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (response.ok) {
        // Optionally, you can display a success message
        // alert("ลูกค้าถูกลบเรียบร้อยแล้ว")
        fetchClients()
      } else {
        const errorMessage = await response.text()
        alert(`Error deleting client: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Error deleting client:", error)
      alert("เกิดข้อผิดพลาดในการลบลูกค้า")
    }
  }

  const handleStatusChange = async (clientUuid, newStatus) => {
    try {
      const payload = {}
      if (newStatus) {
        payload.clientStatus = newStatus
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clients/update/${clientUuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        fetchClients()
      } else {
        const errorMessage = await response.text()
        alert(`Error updating status: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ")
    }
  }

  const handleStartDateChange = async (clientUuid, newStartDate) => {
    try {
      const payload = { clientStartDate: newStartDate }

      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clients/update/${clientUuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        fetchClients()
      } else {
        const errorMessage = await response.text()
        alert(`Error updating start date: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Error updating start date:", error)
      alert("เกิดข้อผิดพลาดในการอัปเดตวันที่เริ่มต้น")
    }
  }

  const handleCompletionDateChange = async (clientUuid, newCompletionDate) => {
    try {
      const payload = { clientCompletionDate: newCompletionDate }

      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}api/clients/update/${clientUuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        fetchClients()
      } else {
        const errorMessage = await response.text()
        alert(`Error updating completion date: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Error updating completion date:", error)
      alert("เกิดข้อผิดพลาดในการอัปเดตวันที่เสร็จสิ้น")
    }
  }

  // Sorting Handler
  const handleSort = (order) => {
    setSortOrder(order)
    setCurrentPage(0) // Reset to first page
  }

  // Filter Handler
  const handleFilterStatus = (status) => {
    setFilterStatus(status)
    setCurrentPage(0) // Reset to first page
  }

  // Function to determine status styling
  const getStatusClass = (status) => {
    switch (status) {
      case "ส่งคำร้อง":
        return "bg-red-500 text-white"
      case "กำลังดำเนินการ":
        return "bg-tfpa_gold text-white"
      case "ดำเนินการเรียบร้อย":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-200 text-black"
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1">
        <CfpSidePanel />
        <div className="flex-1 p-4">
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <input
                type="text"
                placeholder="ค้นหาด้วยรหัสลูกค้าหรือชื่อ"
                className="border rounded p-2 mb-2 md:mb-0 w-full md:w-1/3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex space-x-2">
                <select
                  className="border rounded p-2"
                  value={filterStatus}
                  onChange={(e) => handleFilterStatus(e.target.value)}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="ส่งคำร้อง">ส่งคำร้อง</option>
                  <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                  <option value="ดำเนินการเรียบร้อย">ดำเนินการเรียบร้อย</option>
                </select>
                <button
                  className={`px-4 py-2 rounded ${
                    sortOrder === "desc"
                      ? "bg-tfpa_blue hover:bg-tfpa_blue_hover text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-black"
                  }`}
                  onClick={() => handleSort("desc")}
                >
                  เรียงลำดับโดย วันที่เริ่มต้น ล่าสุด
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    sortOrder === "asc"
                      ? "bg-tfpa_blue hover:bg-tfpa_blue_hover text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-black"
                  }`}
                  onClick={() => handleSort("asc")}
                >
                  เรียงลำดับโดย วันที่เริ่มต้น เก่าสุด
                </button>
              </div>
            </div>

            {/* Clients Table */}
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">รหัสลูกค้า</th>
                  <th className="py-2 px-4 border">ชื่อ - นามสกุล</th>
                  <th className="py-2 px-4 border">สถานะ</th>
                  <th className="py-2 px-4 border">วันที่เริ่มต้น</th>
                  <th className="py-2 px-4 border">วันที่เสร็จสิ้น</th>
                  <th className="py-2 px-4 border">ข้อมูลทั้งหมด</th>
                  <th className="py-2 px-4 border">ลบ</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.clientUuid}>
                    <td className="py-2 px-4 border">
                      {client.clientFormatId}
                    </td>
                    <td className="py-2 px-4 border">
                      {client.clientFullName}
                    </td>
                    <td className="py-2 px-4 border">
                      {/* Custom Dropdown for Status */}
                      <Listbox
                        value={client.clientStatus}
                        onChange={(newStatus) =>
                          handleStatusChange(client.clientUuid, newStatus)
                        }
                      >
                        <div className="relative">
                          <Listbox.Button
                            className={`w-full border rounded-lg px-2 py-1 ${getStatusClass(
                              client.clientStatus
                            )} focus:outline-none`}
                          >
                            {client.clientStatus}
                          </Listbox.Button>
                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-lg">
                            <Listbox.Option value="ส่งคำร้อง">
                              {({ active }) => (
                                <span
                                  className={`block px-4 py-2 ${
                                    active ? "bg-gray-300" : ""
                                  }`}
                                >
                                  ส่งคำร้อง
                                </span>
                              )}
                            </Listbox.Option>
                            <Listbox.Option value="กำลังดำเนินการ">
                              {({ active }) => (
                                <span
                                  className={`block px-4 py-2 ${
                                    active ? "bg-gray-300" : ""
                                  }`}
                                >
                                  กำลังดำเนินการ
                                </span>
                              )}
                            </Listbox.Option>
                            <Listbox.Option value="ดำเนินการเรียบร้อย">
                              {({ active }) => (
                                <span
                                  className={`block px-4 py-2 ${
                                    active ? "bg-gray-300" : ""
                                  }`}
                                >
                                  ดำเนินการเรียบร้อย
                                </span>
                              )}
                            </Listbox.Option>
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </td>
                    <td className="py-2 px-4 border">
                      {(client.clientStatus === "กำลังดำเนินการ" ||
                        client.clientStatus === "ดำเนินการเรียบร้อย") && (
                        <DatePicker
                          selected={
                            client.clientStartDate
                              ? parseISO(client.clientStartDate)
                              : null
                          }
                          onChange={(date) => {
                            const formattedDate = date
                              ? format(date, "yyyy-MM-dd")
                              : null
                            handleStartDateChange(
                              client.clientUuid,
                              formattedDate
                            )
                          }}
                          dateFormat="dd/MM/yyyy"
                          className="border rounded p-1 w-full"
                          placeholderText="DD/MM/YYYY"
                        />
                      )}
                      {!(
                        client.clientStatus === "กำลังดำเนินการ" ||
                        client.clientStatus === "ดำเนินการเรียบร้อย"
                      ) && (
                        <span>
                          {client.clientStartDate
                            ? format(
                                parseISO(client.clientStartDate),
                                "dd/MM/yyyy"
                              )
                            : ""}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 border">
                      {client.clientStatus === "ดำเนินการเรียบร้อย" && (
                        <DatePicker
                          selected={
                            client.clientCompletionDate
                              ? parseISO(client.clientCompletionDate)
                              : null
                          }
                          onChange={(date) => {
                            const formattedDate = date
                              ? format(date, "yyyy-MM-dd")
                              : null
                            handleCompletionDateChange(
                              client.clientUuid,
                              formattedDate
                            )
                          }}
                          dateFormat="dd/MM/yyyy"
                          className="border rounded p-1 w-full"
                          placeholderText="DD/MM/YYYY"
                        />
                      )}
                      {client.clientStatus !== "ดำเนินการเรียบร้อย" && (
                        <span>
                          {client.clientCompletionDate
                            ? format(
                                parseISO(client.clientCompletionDate),
                                "dd/MM/yyyy"
                              )
                            : ""}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-4 py-1 rounded"
                        onClick={() =>
                          handleClientInfo(client.clientUuid, client.clientId)
                        }
                      >
                        ข้อมูลทั้งหมด
                      </button>
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded"
                        onClick={() => handleDelete(client.clientUuid)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center mt-4">
              <div className="flex-1 flex justify-start">
                {currentPage > 0 && (
                  <button
                    onClick={handlePrev}
                    className="px-4 py-2 bg-tfpa_blue hover:bg-tfpa_blue_hover text-white rounded"
                  >
                    ก่อนหน้า
                  </button>
                )}
              </div>
              <div className="flex-1 text-center">
                หน้า {currentPage + 1} จาก {totalPages}
              </div>
              <div className="flex-1 flex justify-end">
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-tfpa_blue hover:bg-tfpa_blue_hover text-white rounded"
                  >
                    ถัดไป
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
