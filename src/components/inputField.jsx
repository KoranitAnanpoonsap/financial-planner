import "@fontsource/ibm-plex-sans-thai"

export default function InputField({
  type,
  label,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="mb-4">
      <label className="block text-tfpa_blue text-sm font-bold mb-2 font-ibm">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-tfpa_blue font-ibm"
      />
    </div>
  )
}
