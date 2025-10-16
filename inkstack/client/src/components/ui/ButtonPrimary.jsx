const ButtonPrimary = ({ buttonText, onClickHandler }) => {
  return (
    <button className="bg-[linear-gradient(90deg,_#4f46e5_0%,_#8635e8_100%)] text-white font-semibold py-3 px-4 rounded cursor-pointer hover:opacity-90 transition w-full" onClick={onClickHandler}>
      {buttonText}
    </button>
  )
}

export default ButtonPrimary
