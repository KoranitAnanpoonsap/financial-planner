import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../components/footer.jsx"
import Header from "../components/header.jsx"

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [clientsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const { cfpId } = useParams()

  const fetchClients = async () => {
    if (!cfpId) {
      console.error("CFP ID is not found in local storage")
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/clients/cfp/${cfpId}?page=${currentPage}&size=${clientsPerPage}&search=${searchQuery}`
      )

      if (!response.ok) {
        // Check if the response is not ok
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(data) // Log the response data
      setClients(data) // Ensure that `data` is an array
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [currentPage, searchQuery])

  const handleNext = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  const handlePrev = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0))
  }

  const handleClientInfo = (clientId) => {
    // Navigate to PortfolioSelectionCFP with the clientId
    navigate(`/${cfpId}/portfolio-selection/${clientId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <div className="bg-blue-500 w-1/4 p-4">
          <h2 className="text-white text-lg mb-4">ลูกค้าทั้งหมดฉัน</h2>
          <button className="block text-white mb-2">รายชื่อส่งคำร้อง</button>
          <button className="block text-white mb-2">
            อยู่ระหว่างดำเนินการ
          </button>
          <button className="block text-white mb-2">ดำเนินการเรียบร้อย</button>
        </div>
        <div className="flex-1 p-4">
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า"
            className="border rounded p-2 mb-4 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">รหัสลูกค้า</th>
                <th className="py-2 px-4 border">ชื่อ - นามสกุล</th>
                <th className="py-2 px-4 border">สถานะ</th>
                <th className="py-2 px-4 border">วันที่ดำเนินการเรียบร้อย</th>
                <th className="py-2 px-4 border">ข้อมูลทั้งหมด</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(clients) &&
                clients.map((client) => (
                  <tr key={client.clientId}>
                    <td className="py-2 px-4 border">
                      {client.clientFormatId}
                    </td>
                    <td className="py-2 px-4 border">{`${client.clientFirstName} ${client.clientLastName}`}</td>
                    <td className="py-2 px-4 border">{client.clientStatus}</td>
                    <td className="py-2 px-4 border">
                      {client.clientCompletionDate}
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        className="text-blue-500"
                        onClick={() => handleClientInfo(client.clientId)}
                      >
                        ข้อมูลทั้งหมด
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              ก่อนหน้า
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
