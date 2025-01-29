import { useState, useEffect } from "react"
import Footer from "../components/footer.jsx"
import Header from "../components/cfpHeader.jsx"
import CfpSidePanel from "../components/cfpSidePanel.jsx"
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

export default function CfpProfilePage() {
  // cfpUuid from local storage
  const [cfpUuid] = useState(localStorage.getItem("cfpUuid") || "")

  // ----- Define field states -----
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nickname, setNickname] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [saveStatus, setSaveStatus] = useState("")

  // Multi-select for charges
  const chargeOptions = [
    "คิดค่าบริการจัดทำแผนการเงิน",
    "คิดค่านายหน้าจากการแนะนำผลิตภัณฑ์",
    "คิดค่าธรรมเนียมการให้คำปรึกษาเป็นรายชั่วโมง",
  ]
  const [selectedCharges, setSelectedCharges] = useState([])

  // Multi-select for expertise
  const expertiseOptions = [
    "การวางแผนการเงินแบบองค์รวม",
    "การวางแผนรายรับรายจ่าย",
    "การวางแผนลงทุน (จัดพอร์ตการลงทุน/ ปรับพอร์ต)",
    "การวางแผนบริหารจัดการหนี้สิน",
    "การวางแผนประกันชีวิตและสุขภาพ",
    "การวางแผนประกันวินาศภัย (รถ บ้าน อื่นๆ)",
    "การวางแผนเกษียณอายุ (ตั้งเป้าหมาย/ลงทุนเพื่อเกษียณ)",
    "การวางแผนการศึกษาบุตร",
    "การวางแผนภาษีบุคคลธรรมดา",
    "การวางแผนภาษีนิติบุคคลและการจดทะเบียนนิติบุคคล",
    "การวางแผนมรดก/การจัดทำพินัยกรรม",
    "Family holding company & Family charter",
  ]
  const [selectedExpertise, setSelectedExpertise] = useState([])

  // Multi-select for service area
  const serviceAreaOptions = [
    "กรุงเทพมหานครและปริมณฑล",
    "ภาคเหนือ",
    "ภาคกลาง",
    "ภาคตะวันออก",
    "ภาคตะวันออกเฉียงเหนือ",
    "ภาคตะวันตก",
    "ภาคใต้",
  ]
  const [selectedServiceAreas, setSelectedServiceAreas] = useState([])

  // Multiple text inputs for qualifications
  const [qualifications, setQualifications] = useState([])

  // Multiple text inputs for educationRecord
  const [educationRecords, setEducationRecords] = useState([])

  // Multiple text inputs for languages
  const [languages, setLanguages] = useState([])

  const [mainOccupation, setMainOccupation] = useState("")
  const [reasonBecomeCfp, setReasonBecomeCfp] = useState("")
  const [introduction, setIntroduction] = useState("")

  const [profileImage, setProfileImage] = useState("")
  const [fileToUpload, setFileToUpload] = useState(null)
  const [fileErrorMessage, setFileErrorMessage] = useState("") // specific error for file size

  // 1) When user selects a file:
  const handleFileChange = (e) => {
    setFileErrorMessage("") // clear previous file error
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0])
    }
  }

  // 2) Upload the file to the server
  const handleUploadImage = async () => {
    if (!fileToUpload) {
      return
    }
    if (!firstName || !lastName) {
      return
    }

    try {
      const formData = new FormData()
      formData.append("file", fileToUpload)
      formData.append("cfpUuid", cfpUuid)
      formData.append("cfpFirstName", firstName)
      formData.append("cfpLastName", lastName)

      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}api/cfp/profile/uploadImage`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!res.ok) {
        const msg = await res.text()
        // If message likely indicates file is too big, show Thai error
        if (
          msg.includes("Maximum upload size exceeded") ||
          msg.includes("MaxUploadSizeExceeded") ||
          msg.includes("Failed to fetch")
        ) {
          setFileErrorMessage("ไฟล์มีขนาดใหญ่เกินไป (จำกัด 10MB)")
        } else {
          setFileErrorMessage("เกิดข้อผิดพลาดในการอัปโหลดรูป: " + msg)
        }
        return
      }

      // The backend returns the raw filename, e.g. "John_Doe.jpg"
      const savedFilename = await res.text()

      // Append cache-buster: "?v=<timestamp>"
      const uniqueUrlParam = "?v=" + Date.now()
      setProfileImage(savedFilename + uniqueUrlParam)

      // Optionally reset the file input
      setFileToUpload(null)
      // If you want to visually clear the file input element, you can do e.target.value = "" in handleFileChange, or add a ref
    } catch (error) {
      if (
        error.message.includes("Maximum upload size exceeded") ||
        error.message.includes("Failed to fetch")
      ) {
        setFileErrorMessage("ไฟล์มีขนาดใหญ่เกินไป (จำกัด 10MB)")
      } else {
        setFileErrorMessage("เกิดข้อผิดพลาดในการอัปโหลดรูป: " + error.message)
      }
    }
  }

  // 3) Build the URL to your GET endpoint
  // If profileImage already has "?v=xxxx", keep that. We'll split it if needed.
  const baseFilename = profileImage.split("?")[0] // "John_Doe.jpg" (strip query param)
  const cacheBuster = profileImage.includes("?")
    ? profileImage.split("?")[1]
    : ""
  const imageUrl = baseFilename
    ? `${import.meta.env.VITE_API_KEY}api/cfp/profile/image/${baseFilename}${
        cacheBuster ? "?" + cacheBuster : ""
      }`
    : ""

  // ----- Handle Checkboxes for multi-select fields -----

  function handleCheckboxChange(value, selectedValues, setSelectedValues) {
    if (selectedValues.includes(value)) {
      // If already in array, remove it
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      // If not in array, add it
      setSelectedValues([...selectedValues, value])
    }
  }

  // ----- Handle multiple text inputs (qualifications, education, languages) -----

  function handleAddItem(setter, items) {
    setter([...items, ""]) // add empty input
  }

  function handleItemChange(index, newValue, items, setter) {
    const updated = [...items]
    updated[index] = newValue
    setter(updated)
  }

  function handleRemoveItem(index, items, setter) {
    const updated = [...items]
    updated.splice(index, 1)
    setter(updated)
  }

  // ----- Fetch existing data if it exists -----
  const fetchCfpData = async () => {
    if (!cfpUuid) return
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}api/cfp/profile/${cfpUuid}`,
        {
          method: "GET",
        }
      )
      if (!response.ok) {
        // Possibly no data set yet or an error
        return
      }
      const data = await response.json()

      // Populate the states
      setProfileImage(data.cfpImage || "")
      setFirstName(data.cfpFirstName || "")
      setLastName(data.cfpLastName || "")
      setNickname(data.cfpNickname || "")
      setContactEmail(data.cfpContactEmail || "")
      setPhoneNumber(data.cfpPhoneNumber || "")
      setLinkedin(data.cfpLinkedin || "")

      // Parse multi-selects (comma-separated)
      setSelectedCharges(data.cfpCharge ? data.cfpCharge.split(",") : [])
      setSelectedExpertise(
        data.cfpExpertise ? data.cfpExpertise.split(",") : []
      )
      setSelectedServiceAreas(
        data.cfpServiceArea ? data.cfpServiceArea.split(",") : []
      )

      // Parse multiple text inputs
      setQualifications(
        data.cfpQualifications ? data.cfpQualifications.split(",") : []
      )
      setEducationRecords(
        data.cfpEducationRecord ? data.cfpEducationRecord.split(",") : []
      )
      setLanguages(data.cfpLanguages ? data.cfpLanguages.split(",") : [])

      setMainOccupation(data.cfpMainOccupation || "")
      setReasonBecomeCfp(data.cfpReasonBecomeCfp || "")
      setIntroduction(data.cfpIntroduction || "")
    } catch (error) {
      console.error("Error fetching cfp data:", error)
    }
  }

  useEffect(() => {
    fetchCfpData()
  }, [])

  // ----- Submit / Save -----
  const handleSave = async () => {
    // 1) Clear the old message so it disappears whenever the user presses "save" again
    setSaveStatus("")

    try {
      // Join multi-select values into comma-separated strings
      const chargeString = selectedCharges.join(",")
      const expertiseString = selectedExpertise.join(",")
      const serviceAreaString = selectedServiceAreas.join(",")

      // Join multiple text inputs with commas
      const qualificationString = qualifications.join(",")
      const educationString = educationRecords.join(",")
      const languagesString = languages.join(",")

      const payload = {
        cfpUuid: cfpUuid, // pass the UUID so the backend knows which record
        cfpFirstName: firstName,
        cfpLastName: lastName,
        cfpNickname: nickname,
        cfpContactEmail: contactEmail,
        cfpPhoneNumber: phoneNumber,
        cfpLinkedin: linkedin,
        cfpImage: profileImage,
        cfpCharge: chargeString,
        cfpExpertise: expertiseString,
        cfpServiceArea: serviceAreaString,
        cfpQualifications: qualificationString,
        cfpEducationRecord: educationString,
        cfpLanguages: languagesString,
        cfpMainOccupation: mainOccupation,
        cfpReasonBecomeCfp: reasonBecomeCfp,
        cfpIntroduction: introduction,
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}api/cfp/profile`,
        {
          method: "PUT", // or POST depending on your choice
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      setSaveStatus(response.ok ? "บันทึกสำเร็จ" : "บันทึกไม่สำเร็จ")
    } catch (error) {
      console.error("Error saving CFP data:", error)
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
            <h1 className="text-2xl font-bold mb-4 text-tfpa_blue">
              โปรไฟล์ CFP
            </h1>

            {/* Profile Image */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                รูปโปรไฟล์
              </label>

              {/* The file input */}
              <input type="file" accept="image/*" onChange={handleFileChange} />

              <button
                type="button"
                onClick={handleUploadImage}
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white p-2 rounded ml-2"
              >
                อัปโหลดรูป
              </button>

              {/* Display file error if any */}
              {fileErrorMessage && (
                <p className="text-red-500 mt-2">{fileErrorMessage}</p>
              )}

              {/* Display the uploaded image if profileImage is set */}
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="CFP"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* First Name */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">ชื่อ</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">นามสกุล</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            {/* Nickname */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">ชื่อเล่น</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            {/* Contact Email */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                อีเมลติดต่อ
              </label>
              <input
                type="text"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                หมายเลขโทรศัพท์
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            {/* LinkedIn */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">LinkedIn</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            {/* Charges (multi-select checkboxes) */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                การคิดค่าบริการ
              </label>
              {chargeOptions.map((charge) => (
                <div key={charge}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCharges.includes(charge)}
                      onChange={() =>
                        handleCheckboxChange(
                          charge,
                          selectedCharges,
                          setSelectedCharges
                        )
                      }
                    />
                    <span className="ml-2">{charge}</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Expertise (multi-select checkboxes) */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                ความเชี่ยวชาญพิเศษ
              </label>
              {expertiseOptions.map((item) => (
                <div key={item}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedExpertise.includes(item)}
                      onChange={() =>
                        handleCheckboxChange(
                          item,
                          selectedExpertise,
                          setSelectedExpertise
                        )
                      }
                    />
                    <span className="ml-2">{item}</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Service Area (multi-select checkboxes) */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                พื้นที่ให้บริการ
              </label>
              {serviceAreaOptions.map((area) => (
                <div key={area}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedServiceAreas.includes(area)}
                      onChange={() =>
                        handleCheckboxChange(
                          area,
                          selectedServiceAreas,
                          setSelectedServiceAreas
                        )
                      }
                    />
                    <span className="ml-2">{area}</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Main occupation */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                อาชีพหลัก ณ ปัจจุบัน
              </label>
              <input
                type="text"
                value={mainOccupation}
                onChange={(e) => setMainOccupation(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            {/* Qualifications (multiple text input) */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                คุณวุฒิวิชาชีพ/ใบอนุญาต
              </label>
              {qualifications.map((q, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        e.target.value,
                        qualifications,
                        setQualifications
                      )
                    }
                    className="border p-2 w-full mr-2"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(index, qualifications, setQualifications)
                    }
                    className="bg-red-500 hover:bg-red-700 text-white px-2 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem(setQualifications, qualifications)}
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-3 py-1 rounded"
              >
                + เพิ่ม คุณวุฒิวิชาชีพ/ใบอนุญาต
              </button>
            </div>

            {/* Education Record (multiple text input) */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                ประวัติการศึกษา
              </label>
              {educationRecords.map((ed, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={ed}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        e.target.value,
                        educationRecords,
                        setEducationRecords
                      )
                    }
                    className="border p-2 w-full mr-2"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(
                        index,
                        educationRecords,
                        setEducationRecords
                      )
                    }
                    className="bg-red-500 hover:bg-red-700 text-white px-2 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleAddItem(setEducationRecords, educationRecords)
                }
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-3 py-1 rounded"
              >
                + เพิ่ม ประวัติการศึกษา
              </button>
            </div>

            {/* Reason become CFP */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                เหตุผลที่มาเป็นนักวางเเผนการเงิน CFP
              </label>
              <textarea
                value={reasonBecomeCfp}
                onChange={(e) => setReasonBecomeCfp(e.target.value)}
                className="border p-2 w-full"
                rows={3}
              ></textarea>
            </div>

            {/* Introduction */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">แนะนำตัว</label>
              <textarea
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                className="border p-2 w-full"
                rows={3}
              ></textarea>
            </div>

            {/* Languages (multiple text input) */}
            <div className="mb-4">
              <label className="block font-bold text-tfpa_blue">
                ภาษาที่ให้บริการคำปรึกษา
              </label>
              {languages.map((lang, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={lang}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        e.target.value,
                        languages,
                        setLanguages
                      )
                    }
                    className="border p-2 w-full mr-2"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(index, languages, setLanguages)
                    }
                    className="bg-red-500 hover:bg-red-700 text-white px-2 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem(setLanguages, languages)}
                className="bg-tfpa_blue hover:bg-tfpa_blue_hover text-white px-3 py-1 rounded"
              >
                + เพิ่ม ภาษาที่ให้บริการคำปรึกษา
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              บันทึก
            </button>

            {saveStatus === "บันทึกสำเร็จ" && (
              <p className="text-green-500 text-left mt-4">{saveStatus}</p>
            )}

            {saveStatus === "บันทึกไม่สำเร็จ" && (
              <p className="text-red-500 text-left mt-4">{saveStatus}</p>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
