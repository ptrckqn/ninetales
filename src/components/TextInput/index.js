import React, { useState } from 'react';

const TextInput = ({ type = 'text', autoFocus, name, label, handleChange, value, gutterBottom, startIcon, textArea }) => {
  const [inputType, setInputType] = useState(type);

  const isPassword = type === 'password';

  let classes = `bg-gray-900 pb-2 ${label ? 'pt-7' : 'pt-2'} ${startIcon ? 'pl-12' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} text-white rounded-lg font-bold ${textArea ? 'text-md' : 'text-lg'} focus:outline-none w-full`;

  const handleViewPassword = (e) => {
    let newInputType = 'password';
    if (inputType === 'password') {
      newInputType = 'text';
    }

    setInputType(newInputType);
  };

  return (
    <div className={`relative w-full ${gutterBottom ? 'mb-4' : ''}`}>
      <label htmlFor={name} className="font-bold text-sm text-gray-600 absolute left-4 top-2">
        {label}
      </label>
      {startIcon && <img src={startIcon} className={`absolute h-6 ${label ? 'top-8' : 'top-1/2 transform -translate-y-1/2'} left-3`} />}
      {textArea ? <textarea name={name} id={name} onChange={handleChange} value={value} className={`${classes} resize-none`} rows={11} /> : <input autoFocus={autoFocus} type={inputType} name={name} id={name} onChange={handleChange} value={value} className={classes} />}

      {isPassword && <img onClick={handleViewPassword} src={inputType === 'password' ? '/svg/eye-off.svg' : '/svg/eye-on.svg'} className="absolute top-8 right-3 h-6 cursor-pointer" />}
    </div>
  );
};

export default TextInput;
