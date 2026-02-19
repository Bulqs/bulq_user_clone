"use client"
import React, { useState } from 'react';
import InputField from '../../inputs/InputField';
import Button from '../../inputs/Button';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}


const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {

    const [formData, setFormData] = useState({
        cardName: '',
        expireDate: '',
        cvc: '',
        cardNumber: '',
    });

    if (!isOpen) return null;

    return (
        <div id="popup" className="z-50 fixed w-full flex justify-center inset-0 bg-appTitleBgColor/80 ">
            <div className="mx-auto container">
                <div className="flex items-center justify-center h-full w-full">
                    <div className="bg-white rounded-md shadow fixed overflow-y-auto sm:h-auto w-10/12 md:w-8/12 lg:w-1/2 2xl:w-2/5">
                        <div className="bg-appTitleBgColor rounded-tl-md rounded-tr-md px-4 md:px-8 md:py-4 py-7 flex items-center justify-between">
                            <p className="text-lg font-semibold text-white ">Add New Payment Card</p>
                            <button onClick={onClose} className="focus:outline-none">
                                <svg width={28} height={28} viewBox="0 0 28 28" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 7L7 21" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 7L21 21" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-4 md:px-10 pt-6 md:pt-2 md:pb-4 pb-7">

                           
                            <div className="flex items-center space-x-9 mt-4">
                                <InputField
                                    id="address"
                                    name="cardName"
                                    value={formData.cardName} // Your state value
                                    placeholder="Input Your Card Name"
                                    required={true}
                                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                                />
                            </div>

                            <form className="mt-4">
                                <div className="flex items-center space-x-4 md:space-x-9">
                                    <InputField
                                        id="expireDate"
                                        type="date"
                                        name="expireDate"
                                        value={formData.expireDate}  // Your state value
                                        placeholder="Input Your Firstname"
                                        required={true}
                                        onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
                                    />

                                    <InputField
                                        id="cvc"
                                        type="number"
                                        name="cvc"
                                        value={formData.cvc} // Your state value
                                        placeholder="Input Your CVC"
                                        required={true}
                                        onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                                    />
                                </div>


                                <div className="flex items-center space-x-9 mt-4">
                                    <InputField
                                        id="cardnumber"
                                        type="number"
                                        name="cardNumber"
                                        value={formData.cardNumber} // Your state value
                                        placeholder="Input Your Card Number"
                                        required={true}
                                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                    />
                                </div>

                            </form>
                            <div className="flex items-center justify-between mt-9">
                                <Button type="submit" className="bg-red-700" onClick={onClose}>
                                    CANCLE
                                </Button>
                                <Button type="submit">
                                    SAVE CARD
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
