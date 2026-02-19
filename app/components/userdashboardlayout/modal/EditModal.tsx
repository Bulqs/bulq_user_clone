"use client"
import React, { useState } from 'react';
import InputField from '../../inputs/InputField';
import Button from '../../inputs/Button';

interface EditModalProps {
    isOpenAddressEditModal: boolean;
    onCloseAddressEditModal: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpenAddressEditModal, onCloseAddressEditModal }) => {

    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        additionalphone: '',
        address: '',
        city: '',
        region: '',
    });

    if (!isOpenAddressEditModal) return null;

    return (
        <div id="popup" className="z-50 fixed w-full flex justify-center inset-0 bg-appTitleBgColor/80 ">
            <div className="mx-auto container">
                <div className="flex items-center justify-center h-full w-full">
                    <div className="bg-white rounded-md shadow fixed overflow-y-auto sm:h-auto w-10/12 md:w-8/12 lg:w-1/2 2xl:w-2/5">
                        <div className="bg-appTitleBgColor rounded-tl-md rounded-tr-md px-4 md:px-8 md:py-4 py-3 flex items-center justify-between">
                            <p className="text-lg font-semibold text-white ">Edit Address</p>
                            <button onClick={onCloseAddressEditModal} className="focus:outline-none">
                                <svg width={28} height={28} viewBox="0 0 28 28" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 7L7 21" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 7L21 21" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-4 md:px-10 pt-6 md:pt-2 md:pb-4 pb-7">

                            <form className="md:mt-4">
                                <div className="flex items-center md:space-x-9 space-x-4">
                                    <InputField
                                        id="FirstName"
                                        name="firstName"
                                        value={formData.firstName}  // Your state value
                                        placeholder="Input Your Firstname"
                                        required={true}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />

                                    <InputField
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName} // Your state value
                                        placeholder="Input Your Lastname"
                                        required={true}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center s md:space-x-9 space-x-4 mt-4">
                                    <InputField
                                        id="phone"
                                        name="phone"
                                        value={formData.phone} // Your state value
                                        placeholder="Input Your Phone Number"
                                        required={true}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}

                                    />

                                    <InputField
                                        id="additionalPhone"
                                        name="additionalphone"
                                        value={formData.additionalphone}  // Your state value
                                        placeholder="Input Your Second Phone Number"
                                        required={true}
                                        onChange={(e) => setFormData({ ...formData, additionalphone: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center  md:space-x-9 space-x-4 mt-4">
                                    <InputField
                                        id="address"
                                        name="address"
                                        value={formData.address} // Your state value
                                        placeholder="Input Your Address"
                                        required={true}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center  md:space-x-9 space-x-4 mt-4">
                                    <InputField
                                        id="region"
                                        name="rigion"
                                        value={formData.region}
                                        placeholder="Select Your Region"
                                        dropdownOptions={['USA', 'Canada', 'UK']}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    />

                                    <InputField
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        placeholder="Select Your City"
                                        dropdownOptions={['USA', 'Canada', 'UK']}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                            </form>
                            <div className="flex items-center justify-between mt-9">
                                <Button type="submit" className="bg-red-700" onClick={onCloseAddressEditModal}>
                                    CANCLE
                                </Button>
                                <Button type="submit">
                                    EDIT ADDRESS
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
