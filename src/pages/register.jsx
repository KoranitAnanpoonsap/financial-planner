import { useState } from "react"
import InputField from "../components/inputField.jsx"
import RadioButtonGroup from "../components/radioButtonGroup.jsx"
import DateInput from "../components/dateInput.jsx"
import FileUpload from "../components/fileUpload.jsx"
import Footer from "../components/footer.jsx"
import Header from "../components/headerLogin.jsx"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 1,
  },
}

const pageTransition = {
  type: "tween", // Smooth tweening for more fluid motion
  ease: "easeInOut", // Easing function for a smoother transition
  duration: 0.3, // Longer duration for a more relaxed effect
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
  const [file, setFile] = useState(null)

  // States for password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // State for error messages
  const [formError, setFormError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // Back button handler
  const handleBack = () => {
    navigate("/client-login")
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setConfirmPasswordError("") // Reset confirm password error when password changes
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    setConfirmPasswordError("") // Reset confirm password error on change
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  const handleRegister = async () => {
    // Validate form
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
      !birthdate ||
      !file
    ) {
      setFormError("กรุณากรอกข้อมูลให้ครบถ้วน") // "Please fill in all the information"
      return
    } else {
      setFormError("") // Clear form error if all fields are filled
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("รหัสผ่านไม่ตรงกัน") // "Passwords do not match"
      return
    } else {
      setConfirmPasswordError("") // Clear error if passwords match
    }

    navigate("/client-login")

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
    formData.append("pdpaFile", file)

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        navigate("/client-login")
      } else {
        const errorMessage = await response.text()
        setFormError(errorMessage) // Handle server error message
      }
    } catch (error) {
      setFormError("เกิดข้อผิดพลาดในการลงทะเบียน") // "An error occurred during registration"
    }
  }

  return (
    <div className="relative w-full h-screen">
      {/* Header */}
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

            {/* Password Input */}
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
                className="absolute right-3 top-1/2 transform text-gray-600 font-ibm"
              >
                {showPassword ? "ซ่อน" : "แสดง"}
              </button>
            </div>

            {/* Confirm Password Input */}
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
                className="absolute right-3 top-1/2 transform text-gray-600 font-ibm"
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
            <FileUpload
              label="PDPA"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              className="w-full bg-tfpa_gold hover:bg-tfpa_gold_hover text-white py-2 rounded-md font-bold"
              onClick={handleRegister}
            >
              ลงทะเบียน
            </button>

            {/* Display Form Error Message Below the Register Button */}
            {formError && (
              <p className="text-red-500 text-center mt-4">{formError}</p>
            )}

            {/* Confirm Password Error Message Below the Register Button */}
            {confirmPasswordError && (
              <p className="text-red-500 text-center mt-4">
                {confirmPasswordError}
              </p>
            )}

            {/* Back Button */}
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
    </div>
  )
}
