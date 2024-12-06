import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export default function ClientBluePanel() {
  const { clientId } = useParams() // Retrieve clientId from URL
  const [clientFullName, setClientFullName] = useState("")
  const [clientFormatId, setClientFormatId] = useState("")

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/clients/${clientId}`
        ) // Assuming this is the correct endpoint
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

  return (
    <div className="bg-blue-500 w-60 p-4">
      <h2 className="text-white text-lg mb-4">{clientFullName}</h2>
      <h2 className="text-white text-lg mb-4">{clientFormatId}</h2>
      <button className="block text-white mb-2">ข้อมูลลูกค้า</button>
      <button className="block text-white mb-2">พอร์ตการลงทุน</button>
      <button className="block text-white mb-2">การวางแผนเป้าหมายเดียว</button>
      <button className="block text-white mb-2">การวางแผนหลายเป้าหมาย</button>
      <button className="block text-white mb-2">ตรวจสุขภาพทางการเงิน</button>
      <button className="block text-white mb-2">การคำนวณภาษี</button>
    </div>
  )
}
