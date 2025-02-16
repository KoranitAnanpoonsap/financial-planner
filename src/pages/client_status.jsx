import { useEffect, useState } from "react"
import Header from "../components/clientHeader.jsx"
import Footer from "../components/footer.jsx"
import { motion } from "framer-motion"
import { FaArrowDown } from "react-icons/fa"

export default function ClientStatusPage() {
  const clientLoginUuid = localStorage.getItem("clientLoginUuid") || "0"
  const [clientInfo, setClientInfo] = useState(null)

  // Mapping for client status (number to text)
  const statusMapping = {
    1: "ส่งคำร้อง",
    2: "กำลังดำเนินการ",
    3: "ดำเนินการเรียบร้อย",
  }

  useEffect(() => {
    fetchData()
  }, [clientLoginUuid])

  const fetchData = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_KEY}api/clients/info/${clientLoginUuid}`
    )
    if (res.ok) {
      const data = await res.json()
      setClientInfo(data)
    } else {
      setClientInfo(null)
    }
  }

  const handleCancel = async () => {
    // Call backend API to dissociate the client from the CFP
    await fetch(
      `${
        import.meta.env.VITE_API_KEY
      }api/clients/dissociate/${clientLoginUuid}`,
      { method: "PUT" }
    )
    // Immediately refresh data after cancellation
    fetchData()
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const dateObj = new Date(dateString)
    return dateObj.toLocaleDateString("th-TH")
  }

  // Helper to render the "ส่งคำร้อง" block
  const renderSendRequestBlock = () => {
    // If there is a CFP chosen, show its name.
    const cfpName =
      clientInfo && clientInfo.cfpOfThisClient
        ? `${clientInfo.cfpOfThisClient.cfpFirstName || ""} ${
            clientInfo.cfpOfThisClient.cfpLastName || ""
          }`.trim()
        : ""
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-tfpa_blue">
            {statusMapping[1]} {cfpName ? `ไปหา CFP ${cfpName}` : ""}
          </p>
          {clientInfo.clientStatus === 1 && (
            <p className="text-sm text-gray-600">
              คำร้องของคุณอยู่ในขั้นตอนการส่งคำร้อง
            </p>
          )}
        </div>
        {clientInfo.clientStatus === 1 && (
          <button
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    )
  }

  // Helper to render the "กำลังดำเนินการ" block
  const renderInProgressBlock = () => {
    return (
      <div>
        <p className="font-bold text-tfpa_blue">{statusMapping[2]}</p>
        {clientInfo.clientStartDate && (
          <p className="text-sm text-gray-600">
            เริ่มวันที่: {formatDate(clientInfo.clientStartDate)}
          </p>
        )}
      </div>
    )
  }

  // Helper to render the "ดำเนินการเรียบร้อย" block
  const renderCompletedBlock = () => {
    return (
      <div>
        <p className="font-bold text-tfpa_blue">{statusMapping[3]}</p>
        <div className="text-sm text-gray-600">
          {clientInfo.clientStartDate && (
            <p>เริ่มวันที่: {formatDate(clientInfo.clientStartDate)}</p>
          )}
          {clientInfo.clientCompletionDate && (
            <p>เสร็จสิ้น: {formatDate(clientInfo.clientCompletionDate)}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen font-ibm">
      <Header />
      <div className="flex flex-1 p-8">
        <motion.div
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-tfpa_blue font-bold text-lg mb-6 text-center">
            สถานะปรึกษากับ CFP
          </h3>
          {clientInfo && (
            <div className="bg-white shadow rounded p-6">
              {/* Case: Client has not chosen any CFP yet */}
              {clientInfo.clientStatus == null && (
                <div className="text-center text-gray-600">
                  ยังไม่ได้เลือก CFP
                </div>
              )}

              {/* Case: Client status is "ส่งคำร้อง" (1) */}
              {clientInfo.clientStatus === 1 && renderSendRequestBlock()}

              {/* Case: Client status is "กำลังดำเนินการ" (2) */}
              {clientInfo.clientStatus === 2 && (
                <>
                  {renderSendRequestBlock()}
                  <div className="flex justify-center my-4">
                    <FaArrowDown className="text-tfpa_blue" />
                  </div>
                  {renderInProgressBlock()}
                </>
              )}

              {/* Case: Client status is "ดำเนินการเรียบร้อย" (3) */}
              {clientInfo.clientStatus === 3 && (
                <>
                  {renderSendRequestBlock()}
                  <div className="flex justify-center my-4">
                    <FaArrowDown className="text-tfpa_blue" />
                  </div>
                  {renderInProgressBlock()}
                  <div className="flex justify-center my-4">
                    <FaArrowDown className="text-tfpa_blue" />
                  </div>
                  {renderCompletedBlock()}
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
