const TextInput = ({ type = "text", name, placeholder, handleChange, value, gutterBottom }) => {
  let classes = "bg-gray-900 py-4 px-6 text-white rounded-lg font-bold text-xl focus:outline-none focus:shadow-outline w-full shadow-inner";

  if (gutterBottom) {
    classes += " mb-4";
  }

  return <input type={type} name={name} placeholder={placeholder} onChange={handleChange} value={value} className={classes} />;
};

export default TextInput;
