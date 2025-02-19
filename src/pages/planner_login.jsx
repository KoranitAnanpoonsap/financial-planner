import LoginTemplate from "../components/login_template.jsx"
import { motion } from "framer-motion"
import emailIcon from "../assets/email.png"
import passwordIcon from "../assets/password.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

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
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
}

export default function PlannerLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState("")

  // Handlers
  const handleEmailChange = (e) => setEmail(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)

  // Back button handler
  const handleBack = () => {
    navigate("/")
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleLogin = async () => {
    setFormError("") // Clear any previous error message
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "api/cfp/login",
        {
          method: "POST",
          body: formData,
        }
      )

      if (response.ok) {
        const data = await response.json()
        const cfpUuid = data.cfpUuid
        localStorage.setItem("cfpUuid", cfpUuid)
        navigate(`/cfp-homepage/`)
      } else {
        const errorMessage = await response.text()
        console.error("Error during login:", errorMessage)
        setFormError("อีเมลหรือรหัสผ่านไม่ถูกต้อง") // Set error message in Thai
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setFormError("เกิดข้อผิดพลาดในระบบ กรุณาลองอีกครั้ง") // Set generic error message in Thai
    }
  }

  return (
    <LoginTemplate>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div
          className="bg-white rounded-[25px] p-10 shadow-lg max-w-md w-full text-center"
          style={{ marginTop: "-50px" }}
        >
          {/* Login Title */}
          <h1 className="text-tfpa_blue font-bold text-3xl px-28 mb-8 uppercase font-ibm">
            เข้าสู่ระบบ
          </h1>

          {/* Display error message if exists */}
          {formError && (
            <div className="mb-4 text-red-600 font-ibm text-sm">
              {formError}
            </div>
          )}

          {/* Email Input */}
          <div className="relative mb-4">
            <img
              src={emailIcon}
              alt="Email Icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6"
            />
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="อีเมล"
              className="w-full p-3 pl-10 border border-gray-300 rounded focus:outline-none focus:border-tfpa_blue font-ibm"
            />
          </div>

          {/* Password Input */}
          <div className="relative mb-4">
            <img
              src={passwordIcon}
              alt="Password Icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="รหัสผ่าน"
              className="w-full p-3 pl-10 border border-gray-300 rounded focus:outline-none focus:border-tfpa_blue font-ibm"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-ibm"
            >
              {showPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>

          {/* Login Button */}
          <button
            className="w-full py-4 bg-tfpa_blue hover:bg-tfpa_blue_hover text-white rounded-3xl transition-colors mb-4 font-ibm"
            onClick={handleLogin}
          >
            เข้าสู่ระบบ
          </button>

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mt-4 px-5 py-2 bg-gray-200 rounded-3xl text-tfpa_blue font-ibm transition-colors duration-300 hover:bg-gray-300"
          >
            กลับ
          </button>
        </div>
      </motion.div>
    </LoginTemplate>
  )
}
