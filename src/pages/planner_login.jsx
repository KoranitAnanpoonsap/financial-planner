import LoginTemplate from "../components/login_template.jsx"
import { motion } from "framer-motion"
import emailIcon from "../assets/email.png"
import passwordIcon from "../assets/password.png"
import { useState } from "react"
import "@fontsource/ibm-plex-sans-thai"
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

  // Handlers
  const handleEmailChange = (e) => setEmail(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)
  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  // Back button handler
  const handleBack = () => {
    navigate("/")
  }

  const handleLogin = async () => {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      const response = await fetch("http://localhost:8080/api/cfp/login", {
        method: "POST",
        body: formData,
      })

      // Check if the response is okay
      if (response.ok) {
        const data = await response.json()
        console.log("Login successful:", data) // Log data to check its structure
        const cfpId = data.cfpId
        navigate(`/cfp-homepage/${cfpId}`)
      } else {
        const errorMessage = await response.text()
        console.error("Error during login:", errorMessage) // Log error message
        setFormError(errorMessage)
      }
    } catch (error) {
      console.error("Fetch error:", error) // Log the error
      alert(error) // Alert error
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
              onMouseDown={togglePasswordVisibility}
              onMouseUp={togglePasswordVisibility}
              onMouseLeave={() => setShowPassword(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-ibm"
            >
              {showPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>

          {/* Login Button */}
          <button
            className="w-full py-4 bg-tfpa_blue hover:bg-tfpa_blue_hover text-white rounded-3xl transition-colors mb-4 font-ibm"
            onClick={handleLogin} // Call handleLogin on click
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