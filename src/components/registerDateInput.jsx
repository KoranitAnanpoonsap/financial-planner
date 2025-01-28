import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function DateInput({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-tfpa_blue text-sm font-bold mb-2 font-ibm">
        {label}
      </label>
      <DatePicker
        selected={value}
        onChange={onChange}
        dateFormat="dd/MM/yyyy" // Display format
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
        placeholderText="DD/MM/YYYY"
      />
    </div>
  )
}
