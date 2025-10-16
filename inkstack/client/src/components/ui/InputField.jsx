const InputField = ({ type, placeholder, value, onChangeHandler }) => {
  return (
    <div className="grow">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChangeHandler}
        className="bg-accent--ink p-3 rounded-md w-full outline-0 focus:ring-2 focus:ring-zinc-700 transition"
        required
      />
    </div>
  )
}

export default InputField
