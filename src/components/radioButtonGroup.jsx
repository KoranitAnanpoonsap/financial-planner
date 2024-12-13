export default function RadioButtonGroup({
  label,
  options,
  name,
  selectedValue,
  onChange,
}) {
  return (
    <div className="mb-4">
      <label className="block text-tfpa_blue text-sm font-bold mb-2 font-ibm">
        {label}
      </label>
      <div className="flex space-x-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="inline-flex items-center font-ibm"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={onChange}
              className="form-radio text-[#F7931D]"
            />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
