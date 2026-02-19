import React from 'react';

interface TextareaProps {
  id?: string;
  name: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  value?: string; // <--- ADD THIS LINE
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Ensure correct type
}

const ReusableTextarea: React.FC<TextareaProps> = ({
  id,
  name,
  placeholder,
  rows = 4,
  className,
  value, // <--- Destructure
  onChange
}) => {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      className={className}
      value={value} // <--- Pass to textarea
      onChange={onChange}
    />
  );
};

export default ReusableTextarea;

// import React from 'react';

// interface TextareaProps {
//     id: string;
//     name: string;
//     placeholder: string;
//     rows?: number;
//     className?: string;
//     defaultValue?: string;
// }

// const ReusableTextarea: React.FC<TextareaProps> = ({
//     id,
//     name,
//     placeholder,
//     rows = 5,
//     className = '',
//     defaultValue = '',
// }) => {
//     return (
//         <textarea
//             id={id}
//             name={name}
//             required
//             // Styles updated to match InputField: Text Black, Modern Border & Focus
//             className={`w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 text-black placeholder-gray-400 font-medium resize-none shadow-sm ${className}`}
//             placeholder={placeholder}
//             rows={rows}
//             defaultValue={defaultValue}
//         />
//     );
// };

// export default ReusableTextarea;
