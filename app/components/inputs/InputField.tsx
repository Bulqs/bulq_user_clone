import React, { ChangeEvent } from 'react';

const countryCodes = [
    { code: '+1', name: 'United States' },
    { code: '+7', name: 'Russia' },
    { code: '+20', name: 'Egypt' },
    { code: '+27', name: 'South Africa' },
    { code: '+30', name: 'Greece' },
    { code: '+31', name: 'Netherlands' },
    { code: '+32', name: 'Belgium' },
    { code: '+33', name: 'France' },
    { code: '+34', name: 'Spain' },
    { code: '+36', name: 'Hungary' },
    { code: '+39', name: 'Italy' },
    { code: '+40', name: 'Romania' },
    { code: '+41', name: 'Switzerland' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+45', name: 'Denmark' },
    { code: '+46', name: 'Sweden' },
    { code: '+47', name: 'Norway' },
    { code: '+48', name: 'Poland' },
    { code: '+49', name: 'Germany' },
    { code: '+51', name: 'Peru' },
    { code: '+52', name: 'Mexico' },
    { code: '+53', name: 'Cuba' },
    { code: '+54', name: 'Argentina' },
    { code: '+55', name: 'Brazil' },
    { code: '+56', name: 'Chile' },
    { code: '+57', name: 'Colombia' },
    { code: '+58', name: 'Venezuela' },
    { code: '+60', name: 'Malaysia' },
    { code: '+61', name: 'Australia' },
    { code: '+62', name: 'Indonesia' },
    { code: '+63', name: 'Philippines' },
    { code: '+64', name: 'New Zealand' },
    { code: '+65', name: 'Singapore' },
    { code: '+66', name: 'Thailand' },
    { code: '+81', name: 'Japan' },
    { code: '+82', name: 'South Korea' },
    { code: '+84', name: 'Vietnam' },
    { code: '+86', name: 'China' },
    { code: '+90', name: 'Turkey' },
    { code: '+91', name: 'India' },
    { code: '+92', name: 'Pakistan' },
    { code: '+93', name: 'Afghanistan' },
    { code: '+94', name: 'Sri Lanka' },
    { code: '+95', name: 'Myanmar' },
    { code: '+98', name: 'Iran' },
    { code: '+211', name: 'South Sudan' },
    { code: '+212', name: 'Morocco' },
    { code: '+213', name: 'Algeria' },
    { code: '+216', name: 'Tunisia' },
    { code: '+218', name: 'Libya' },
    { code: '+220', name: 'Gambia' },
    { code: '+221', name: 'Senegal' },
    { code: '+222', name: 'Mauritania' },
    { code: '+223', name: 'Mali' },
    { code: '+224', name: 'Guinea' },
    { code: '+225', name: 'Ivory Coast' },
    { code: '+226', name: 'Burkina Faso' },
    { code: '+227', name: 'Niger' },
    { code: '+228', name: 'Togo' },
    { code: '+229', name: 'Benin' },
    { code: '+230', name: 'Mauritius' },
    { code: '+231', name: 'Liberia' },
    { code: '+232', name: 'Sierra Leone' },
    { code: '+233', name: 'Ghana' },
    { code: '+234', name: 'Nigeria' },
    { code: '+235', name: 'Chad' },
    { code: '+236', name: 'Central African Republic' },
    { code: '+237', name: 'Cameroon' },
    { code: '+238', name: 'Cape Verde' },
    { code: '+239', name: 'São Tomé and Príncipe' },
    { code: '+240', name: 'Equatorial Guinea' },
    { code: '+241', name: 'Gabon' },
    { code: '+242', name: 'Congo (Brazzaville)' },
    { code: '+243', name: 'Congo (Kinshasa)' },
    { code: '+244', name: 'Angola' },
    { code: '+245', name: 'Guinea-Bissau' },
    { code: '+246', name: 'Diego Garcia' },
    { code: '+248', name: 'Seychelles' },
    { code: '+249', name: 'Sudan' },
    { code: '+250', name: 'Rwanda' },
    { code: '+251', name: 'Ethiopia' },
    { code: '+252', name: 'Somalia' },
    { code: '+253', name: 'Djibouti' },
    { code: '+254', name: 'Kenya' },
    { code: '+255', name: 'Tanzania' },
    { code: '+256', name: 'Uganda' },
    { code: '+257', name: 'Burundi' },
    { code: '+258', name: 'Mozambique' },
    { code: '+260', name: 'Zambia' },
    { code: '+261', name: 'Madagascar' },
    { code: '+262', name: 'Réunion' },
    { code: '+263', name: 'Zimbabwe' },
    { code: '+264', name: 'Namibia' },
    { code: '+265', name: 'Malawi' },
    { code: '+266', name: 'Lesotho' },
    { code: '+267', name: 'Botswana' },
    { code: '+268', name: 'Eswatini' },
    { code: '+269', name: 'Comoros' },
    { code: '+290', name: 'Saint Helena' },
    { code: '+291', name: 'Eritrea' },
    { code: '+297', name: 'Aruba' },
    { code: '+298', name: 'Faroe Islands' },
    { code: '+299', name: 'Greenland' },
];

interface InputFieldProps {
    type?: string;
    id?: string;
    name: string;
    value?: string | number;
    placeholder?: string;
    required?: boolean;
    className?: string;
    // Updated type to support objects with labels/values
    dropdownOptions?: (string | { label: string; value: string | number })[]; 
    isPhone?: boolean;
    countryCode?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onCountryCodeChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    type = 'text',
    id,
    name,
    value,
    placeholder,
    required = false,
    dropdownOptions,
    className,
    isPhone = false,
    countryCode = '+234',
    onChange,
    onCountryCodeChange,
    disabled,
}) => {
    
    // Modern Base Styles: Text is explicitly black
    // Added logic for disabled state (opacity + cursor)
    const baseInputStyles = `w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 text-black placeholder-gray-400 font-medium ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''} ${className || ''}`;

    return (
        <>
            {dropdownOptions ? (
                <div className="relative">
                    <select
                        id={id}
                        name={name}
                        value={value}
                        required={required}
                        onChange={onChange}
                        disabled={disabled}
                        className={`${baseInputStyles} appearance-none cursor-pointer`}
                    >
                        <option value="" disabled className="text-gray-400">
                            {placeholder}
                        </option>
                        {dropdownOptions.map((option, index) => {
                            // Logic to handle both string array and object array
                            const label = typeof option === 'string' ? option : option.label;
                            const val = typeof option === 'string' ? option : option.value;

                            return (
                                <option key={index} value={val} className="text-black py-1">
                                    {label}
                                </option>
                            );
                        })}
                    </select>
                    {/* Custom Arrow Icon for Dropdown */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            ) : isPhone ? (
                <div className="flex items-center">
                    <div className="relative">
                        <select
                            value={countryCode}
                            onChange={onCountryCodeChange}
                            disabled={disabled}
                            className={`bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg px-2 md:px-3 py-3 text-sm text-black focus:outline-none focus:ring-0 h-full font-bold cursor-pointer appearance-none w-20 md:w-24 text-center ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {countryCodes.map((country, index) => (
                                <option key={index} value={country.code} className="text-black">
                                    {country.code}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input
                        type="number"
                        id={id}
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        required={required}
                        onChange={onChange}
                        disabled={disabled}
                        className={`w-full bg-white border border-gray-300 rounded-r-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 text-black placeholder-gray-400 font-medium ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''} ${className || ''}`}
                    />
                </div>
            ) : (
                <input
                    type={type}
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    required={required}
                    onChange={onChange}
                    disabled={disabled}
                    className={baseInputStyles}
                />
            )}
        </>
    );
};

export default InputField;

// import React from 'react';

// const countryCodes = [
//     { code: '+1', name: 'United States' },
//     { code: '+7', name: 'Russia' },
//     { code: '+20', name: 'Egypt' },
//     { code: '+27', name: 'South Africa' },
//     { code: '+30', name: 'Greece' },
//     { code: '+31', name: 'Netherlands' },
//     { code: '+32', name: 'Belgium' },
//     { code: '+33', name: 'France' },
//     { code: '+34', name: 'Spain' },
//     { code: '+36', name: 'Hungary' },
//     { code: '+39', name: 'Italy' },
//     { code: '+40', name: 'Romania' },
//     { code: '+41', name: 'Switzerland' },
//     { code: '+44', name: 'United Kingdom' },
//     { code: '+45', name: 'Denmark' },
//     { code: '+46', name: 'Sweden' },
//     { code: '+47', name: 'Norway' },
//     { code: '+48', name: 'Poland' },
//     { code: '+49', name: 'Germany' },
//     { code: '+51', name: 'Peru' },
//     { code: '+52', name: 'Mexico' },
//     { code: '+53', name: 'Cuba' },
//     { code: '+54', name: 'Argentina' },
//     { code: '+55', name: 'Brazil' },
//     { code: '+56', name: 'Chile' },
//     { code: '+57', name: 'Colombia' },
//     { code: '+58', name: 'Venezuela' },
//     { code: '+60', name: 'Malaysia' },
//     { code: '+61', name: 'Australia' },
//     { code: '+62', name: 'Indonesia' },
//     { code: '+63', name: 'Philippines' },
//     { code: '+64', name: 'New Zealand' },
//     { code: '+65', name: 'Singapore' },
//     { code: '+66', name: 'Thailand' },
//     { code: '+81', name: 'Japan' },
//     { code: '+82', name: 'South Korea' },
//     { code: '+84', name: 'Vietnam' },
//     { code: '+86', name: 'China' },
//     { code: '+90', name: 'Turkey' },
//     { code: '+91', name: 'India' },
//     { code: '+92', name: 'Pakistan' },
//     { code: '+93', name: 'Afghanistan' },
//     { code: '+94', name: 'Sri Lanka' },
//     { code: '+95', name: 'Myanmar' },
//     { code: '+98', name: 'Iran' },
//     { code: '+211', name: 'South Sudan' },
//     { code: '+212', name: 'Morocco' },
//     { code: '+213', name: 'Algeria' },
//     { code: '+216', name: 'Tunisia' },
//     { code: '+218', name: 'Libya' },
//     { code: '+220', name: 'Gambia' },
//     { code: '+221', name: 'Senegal' },
//     { code: '+222', name: 'Mauritania' },
//     { code: '+223', name: 'Mali' },
//     { code: '+224', name: 'Guinea' },
//     { code: '+225', name: 'Ivory Coast' },
//     { code: '+226', name: 'Burkina Faso' },
//     { code: '+227', name: 'Niger' },
//     { code: '+228', name: 'Togo' },
//     { code: '+229', name: 'Benin' },
//     { code: '+230', name: 'Mauritius' },
//     { code: '+231', name: 'Liberia' },
//     { code: '+232', name: 'Sierra Leone' },
//     { code: '+233', name: 'Ghana' },
//     { code: '+234', name: 'Nigeria' },
//     { code: '+235', name: 'Chad' },
//     { code: '+236', name: 'Central African Republic' },
//     { code: '+237', name: 'Cameroon' },
//     { code: '+238', name: 'Cape Verde' },
//     { code: '+239', name: 'São Tomé and Príncipe' },
//     { code: '+240', name: 'Equatorial Guinea' },
//     { code: '+241', name: 'Gabon' },
//     { code: '+242', name: 'Congo (Brazzaville)' },
//     { code: '+243', name: 'Congo (Kinshasa)' },
//     { code: '+244', name: 'Angola' },
//     { code: '+245', name: 'Guinea-Bissau' },
//     { code: '+246', name: 'Diego Garcia' },
//     { code: '+248', name: 'Seychelles' },
//     { code: '+249', name: 'Sudan' },
//     { code: '+250', name: 'Rwanda' },
//     { code: '+251', name: 'Ethiopia' },
//     { code: '+252', name: 'Somalia' },
//     { code: '+253', name: 'Djibouti' },
//     { code: '+254', name: 'Kenya' },
//     { code: '+255', name: 'Tanzania' },
//     { code: '+256', name: 'Uganda' },
//     { code: '+257', name: 'Burundi' },
//     { code: '+258', name: 'Mozambique' },
//     { code: '+260', name: 'Zambia' },
//     { code: '+261', name: 'Madagascar' },
//     { code: '+262', name: 'Réunion' },
//     { code: '+263', name: 'Zimbabwe' },
//     { code: '+264', name: 'Namibia' },
//     { code: '+265', name: 'Malawi' },
//     { code: '+266', name: 'Lesotho' },
//     { code: '+267', name: 'Botswana' },
//     { code: '+268', name: 'Eswatini' },
//     { code: '+269', name: 'Comoros' },
//     { code: '+290', name: 'Saint Helena' },
//     { code: '+291', name: 'Eritrea' },
//     { code: '+297', name: 'Aruba' },
//     { code: '+298', name: 'Faroe Islands' },
//     { code: '+299', name: 'Greenland' },
// ];

// interface InputFieldProps {
//     type?: string;
//     id: string;
//     name: string;
//     value?: string | number;
//     placeholder?: string;
//     required?: boolean;
//     className?: any;
//     dropdownOptions?: any[]; //string was initially there
//     isPhone?: boolean;
//     countryCode?: string;
//     onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//     onCountryCodeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//     disabled?: boolean; // <--- ADD THIS LINE
// }

// const InputField: React.FC<InputFieldProps> = ({
//     type = 'text',
//     id,
//     name,
//     value,
//     placeholder,
//     required = false,
//     dropdownOptions,
//     className,
//     isPhone = false,
//     countryCode = '+234',
//     onChange,
//     onCountryCodeChange,
// }) => {
    
//     // Modern Base Styles: Text is explicitly black
//     const baseInputStyles = `w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 text-black placeholder-gray-400 font-medium ${className || ''}`;

//     return (
//         <>
//             {dropdownOptions ? (
//                 <div className="relative">
//                     <select
//                         id={id}
//                         name={name}
//                         value={value}
//                         required={required}
//                         onChange={onChange}
//                         className={`${baseInputStyles} appearance-none cursor-pointer`}
//                     >
//                         <option value="" disabled className="text-gray-400">
//                             {placeholder}
//                         </option>
//                         {dropdownOptions.map((option, index) => (
//                             <option key={index} value={option} className="text-black py-1">
//                                 {option}
//                             </option>
//                         ))}
//                     </select>
//                     {/* Custom Arrow Icon for Dropdown */}
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
//                         <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
//                     </div>
//                 </div>
//             ) : isPhone ? (
//                 <div className="flex items-center">
//                     <div className="relative">
//                         <select
//                             value={countryCode}
//                             onChange={onCountryCodeChange}
//                             className="bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg px-2 md:px-3 py-3 text-sm text-black focus:outline-none focus:ring-0 h-full font-bold cursor-pointer appearance-none w-20 md:w-24 text-center"
//                         >
//                             {countryCodes.map((country, index) => (
//                                 <option key={index} value={country.code} className="text-black">
//                                     {country.code}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <input
//                         type="number"
//                         id={id}
//                         name={name}
//                         value={value}
//                         placeholder={placeholder}
//                         required={required}
//                         onChange={onChange}
//                         className={`w-full bg-white border border-gray-300 rounded-r-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 text-black placeholder-gray-400 font-medium ${className || ''}`}
//                     />
//                 </div>
//             ) : (
//                 <input
//                     type={type}
//                     id={id}
//                     name={name}
//                     value={value}
//                     placeholder={placeholder}
//                     required={required}
//                     onChange={onChange}
//                     className={baseInputStyles}
//                 />
//             )}
//         </>
//     );
// };

// export default InputField;
