import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { useDispatch } from 'react-redux';
// import { uiSlice } from '../slices/uiSlice';
// import { referralSlice } from '../slices/referralSlice';

const ReferScreen = () => {
    // const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");

    // Dummy data for demonstration
    const dummyReferralData = {
        name: "John Doe",
        mobile: "1234567890",
        status: "Pending",
        bonus: 0,
        discountDate: null
    };

    const validateMobile = (m) => /^\d{10}$/.test(m);

    const onSubmit = (data) => {
        // Commenting out dispatch and using dummy data for now
        // if (!data.name.trim()) {
        //   dispatch(uiSlice.actions.showModal({ title: "Error", description: "Please enter your friend's name." }));
        //   return;
        // }
        // if (!validateMobile(data.mobile.trim())) {
        //   dispatch(uiSlice.actions.showModal({ title: "Error", description: "Please enter a valid 10-digit mobile number." }));
        //   return;
        // }
        // dispatch(uiSlice.actions.showLoader());
        setTimeout(() => {
            // dispatch(uiSlice.actions.hideLoader());
            // dispatch(referralSlice.actions.addReferral({
            //   id: Date.now(),
            //   name: data.name.trim(),
            //   status: "Pending",
            //   bonus: 0,
            //   discountDate: null,
            // }));
            // dispatch(uiSlice.actions.showModal({
            //   title: "Referral Sent",
            //   description: `Referral code sent to ${data.name.trim()} (${data.mobile.trim()}). Thank you!`,
            //   onOk: () => dispatch(uiSlice.actions.setScreen("referralTracking")),
            // }));
            console.log("Referral Sent:", dummyReferralData); // Log for demo purposes
        }, 1500);
    };

    return (
        <section className="min-h-screen px-6 max-w-md mx-auto py-8" aria-label="Refer a Friend Screen">
            <h1 className="text-3xl font-semibold text-blue-600 mb-6">Refer a Friend</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <label htmlFor="referral-name" className="block text-sm font-medium mb-1">
                    Friend's Name
                </label>
                <input
                    type="text"
                    id="referral-name"
                    name="referral-name"
                    placeholder="Enter name"
                    {...register("name", { required: "Friend's name is required." })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

                <label htmlFor="referral-mobile" className="block text-sm font-medium mb-1">
                    Friend's Mobile Number
                </label>
                <input
                    type="tel"
                    id="referral-mobile"
                    name="referral-mobile"
                    placeholder="Enter mobile number"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    {...register("mobile", {
                        required: "Mobile number is required.",
                        validate: value => validateMobile(value) || "Enter a valid 10-digit mobile number."
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.mobile && <p className="text-red-600 text-sm">{errors.mobile.message}</p>}

                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700 text-sm">
                    <p>Benefits of referral:</p>
                    <ul className="list-disc list-inside">
                        <li>₹200 bonus on successful installation</li>
                        <li>Discount on next bill</li>
                    </ul>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-300"
                    aria-label="Send Referral"
                >
                    Send Referral
                </button>
            </form>
        </section>
    );
};

export default ReferScreen;
