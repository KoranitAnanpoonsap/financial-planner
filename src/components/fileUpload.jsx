export default function FileUpload({ label, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-tfpa_blue text-sm font-bold mb-2 font-ibm">
        {label}
      </label>
      <input
        type="file"
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tfpa_blue"
      />
    </div>
  )
}
