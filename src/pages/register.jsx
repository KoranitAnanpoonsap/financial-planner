import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import InputField from "../components/inputField.jsx"
import RadioButtonGroup from "../components/radioButtonGroup.jsx"
import DateInput from "../components/dateInput.jsx"
import Footer from "../components/footer.jsx"
import Header from "../components/headerLogin.jsx"
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

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [title, setTitle] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gender, setGender] = useState("")
  const [phone, setPhone] = useState("")
  const [birthdate, setBirthdate] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formError, setFormError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)

  const handleBack = () => {
    navigate("/client-login")
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setConfirmPasswordError("")
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    setConfirmPasswordError("")
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  const validateForm = () => {
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !idNumber ||
      !title ||
      !firstName ||
      !lastName ||
      !gender ||
      !phone ||
      !birthdate
    ) {
      setFormError("กรุณากรอกข้อมูลให้ครบถ้วน")
      return false
    } else {
      setFormError("")
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("รหัสผ่านไม่ตรงกัน")
      return false
    } else {
      setConfirmPasswordError("")
    }
    return true
  }

  const handleRegisterClick = () => {
    // Validate first
    if (validateForm()) {
      // Show privacy modal
      setShowPrivacyModal(true)
    }
  }

  const handleConfirmPrivacy = async () => {
    // User confirmed privacy, now proceed with register
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    formData.append("nationalId", idNumber)
    formData.append("title", title)
    formData.append("firstName", firstName)
    formData.append("lastName", lastName)
    formData.append("gender", gender)
    formData.append("phoneNumber", phone)
    formData.append("dateOfBirth", birthdate)

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        navigate("/client-login")
      } else {
        const errorMessage = await response.text()
        setFormError(errorMessage)
      }
    } catch (error) {
      setFormError("เกิดข้อผิดพลาดในการลงทะเบียน")
    }
  }

  return (
    <div className="relative w-full h-screen">
      <Header />
      <div className="w-full min-h-screen bg-white flex flex-col items-center overflow-auto">
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="w-full max-w-lg bg-gray-200 p-8 rounded-lg shadow-xl m-6">
            <h1 className="text-center font-bold text-3xl mb-6 font-ibm">
              <span className="text-tfpa_gold">ลงทะเบียนผู้ใช้ใหม่สำหรับ</span>
              <span className="text-tfpa_blue">ลูกค้า</span>
            </h1>

            <h2 className="text-tfpa_gold mb-4 text-xl font-bold font-ibm">
              ข้อมูลเข้าสู่ระบบ
            </h2>
            <InputField
              type="email"
              label="อีเมล"
              placeholder="username@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative mb-4">
              <label className="block text-tfpa_blue text-sm font-bold mb-2 font-ibm">
                รหัสผ่าน
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="รหัสผ่าน"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-tfpa_blue font-ibm"
              />
              <button
                type="button"
                onMouseDown={togglePasswordVisibility}
                onMouseUp={togglePasswordVisibility}
                onMouseLeave={() => setShowPassword(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-ibm"
              >
                {showPassword ? "ซ่อน" : "แสดง"}
              </button>
            </div>

            <div className="relative mb-4">
              <label className="block text-tfpa_blue text-sm font-bold mb-2 font-ibm">
                ยืนยันรหัสผ่าน
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="ยืนยันรหัสผ่าน"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-tfpa_blue font-ibm"
              />
              <button
                type="button"
                onMouseDown={toggleConfirmPasswordVisibility}
                onMouseUp={toggleConfirmPasswordVisibility}
                onMouseLeave={() => setShowConfirmPassword(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-ibm"
              >
                {showConfirmPassword ? "ซ่อน" : "แสดง"}
              </button>
            </div>

            <h2 className="text-tfpa_gold mb-4 text-xl font-bold font-ibm">
              ข้อมูลส่วนตัว
            </h2>
            <InputField
              type="text"
              label="เลขประจำตัวประชาชน"
              placeholder="รหัสบัตรประชาชนจำนวน 13 หลัก"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
            <RadioButtonGroup
              label="คำนำหน้าชื่อ"
              options={[
                { value: "นาย", label: "นาย" },
                { value: "นาง", label: "นาง" },
                { value: "นางสาว", label: "นางสาว" },
              ]}
              name="title"
              selectedValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <InputField
              type="text"
              label="ชื่อ"
              placeholder="ชื่อ"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputField
              type="text"
              label="นามสกุล"
              placeholder="นามสกุล"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <RadioButtonGroup
              label="เพศ"
              options={[
                { value: "ชาย", label: "ชาย" },
                { value: "หญิง", label: "หญิง" },
              ]}
              name="gender"
              selectedValue={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <InputField
              type="tel"
              label="เบอร์โทรศัพท์"
              placeholder="099-123-1234"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <DateInput
              label="วัน/เดือน/ปีเกิด"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />

            <button
              className="w-full bg-tfpa_gold hover:bg-tfpa_gold_hover text-white py-2 rounded-md font-bold"
              onClick={handleRegisterClick}
            >
              ลงทะเบียน
            </button>

            {formError && (
              <p className="text-red-500 text-center mt-4">{formError}</p>
            )}
            {confirmPasswordError && (
              <p className="text-red-500 text-center mt-4">
                {confirmPasswordError}
              </p>
            )}

            <div className="flex justify-center mt-4">
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-slate-300 rounded-3xl text-tfpa_blue font-ibm transition-colors duration-300 hover:bg-gray-300"
              >
                กลับ
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded p-6 max-w-2xl w-full">
            <h2 className="text-center text-xl font-bold mb-4 font-ibm">
              ข้อมูลสำคัญ
              <br />
              ความเป็นส่วนตัวและคุ้มครองข้อมูลของคุณ
            </h2>
            <div className="text-sm text-tfpa_blue mb-4 font-ibm space-y-2 max-h-96 overflow-auto">
              <p>
                เราให้ความสำคัญกับความเป็นส่วนตัวและการป้องกันข้อมูลของคุณอย่างจริงจังในกรอบของการปฏิบัติที่มุ่งมั่น
                ที่จะปกป้องข้อมูลส่วนบุคคลของคุณและปฏิบัติตามกฎหมายที่เกี่ยวข้องที่รวมถึงพรบ.
                คุ้มครองข้อมูลส่วนบุคคล (PDPA)
              </p>
              <p>
                เราขอขอบคุณให้ความยินยอมในการเก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลของคุณ
                ทำไมเราต้องการข้อมูลของคุณ:
                เราเก็บและประมวลผลข้อมูลส่วนบุคคลของคุณเพื่อวัตถุประสงค์ต่อไปนี้:
                เพื่อให้บริการการวางแผนการเงินที่ปรับตัวตามคุณ
              </p>
              <p>
                วิธีการป้องกันข้อมูลของคุณ:
                ข้อมูลส่วนบุคคลของคุณถูกจัดการด้วยความลับและความปลอดภัยสูงสุด
                เราได้นำมาตรการทางเทคนิคและระบบการจัดการที่เข้มงวดเพื่อป้องกันข้อมูลของคุณจากการเข้าถึงโดยไม่ได้รับ
                อนุญาต การเปิดเผย การเปลี่ยนแปลง และการทำลาย
              </p>
              <p>
                สิทธิของคุณ: ภายใต้ PDPA และกฎหมายคุ้มครองข้อมูลอื่น ๆ
                คุณมีสิทธิพิเศษเกี่ยวกับข้อมูลส่วนบุคคลของคุณ
              </p>
              <p>
                สิทธิเหล่านี้รวมถึงสิทธิในการเข้าถึง การแก้ไข การลบ
                หรือการจำกัดการประมวลผลข้อมูลของคุณ คำขอความยินยอม:
                โดยการที่คุณยังคงใช้เว็บไซต์และบริการของเราต่อไปนี้
                คุณยืนยันความยินยอมโดยชัดแจ้งให้เราเก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลของคุณเพื่อวัตถุประสงค์ที่
                ระบุและในความเหมาะสมกับนโยบายความเป็นส่วนตัวของเรา
              </p>
              <p>การถอนความยินยอม: คุณมีสิทธิในการถอนความยินยอมได้ตลอดเวลา</p>
              <p>
                หากคุณต้องการถอนความยินยอมหรือมีคำถามเกี่ยวกับวิธีการจัดการข้อมูลของเรา
                กรุณาติดต่อเรา
              </p>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mr-2"
              />
              <span className="font-ibm text-tfpa_blue text-sm">
                ฉันได้อ่านและยอมรับข้อกำหนดและเงื่อนไขทั้งหมด
              </span>
            </div>
            <div className="flex justify-end">
              <button
                disabled={!acceptedPrivacy}
                onClick={handleConfirmPrivacy}
                className={`px-4 py-2 rounded font-bold ${
                  acceptedPrivacy
                    ? "bg-tfpa_gold text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
