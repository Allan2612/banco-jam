"use client";

import React, { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    accnum: "",
    pin: "",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log(form);
    // Redirigir o mostrar mensaje de éxito
  };

  return (
    <div>
      <div className="relative min-h-screen grid bg-black">
        <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0">
          <div
            className="relative sm:w-1/2 xl:w-3/5 bg-blue-500 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden text-white bg-no-repeat bg-cover"
            style={{
               backgroundImage: "url(/images/bank.png)",
            }}
          >
            <div className="absolute bg-black opacity-25 inset-0 z-0"></div>
            <div className="w-full lg:max-w-2xl md:max-w-md z-10 items-center text-center">
              <div className="font-bold leading-tight mb-6 mx-auto w-full content-center items-center"></div>
            </div>
          </div>

          <div className="md:flex md:items-center md:justify-left w-full sm:w-auto md:h-full xl:w-1/2 p-8 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none">
            <div className="max-w-xl w-full space-y-12">
              <div className="lg:text-left text-center">
                <div className="flex items-center justify-center">
                  <div className="bg-black flex flex-col w-80 border border-gray-900 rounded-lg px-8 py-10">
                    <form
                      className="flex flex-col space-y-8 mt-10"
                      onSubmit={onSubmit}
                    >
                      <label className="font-bold text-lg text-white">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="accnum"
                        value={form.accnum}
                        onChange={handleChange}
                        placeholder="Account number"
                        className="border rounded-lg py-3 px-3 mt-4 bg-black border-indigo-600 placeholder-white-500 text-white"
                        required
                      />
                      <label className="font-bold text-lg text-white">
                        Pin
                      </label>
                      <input
                        type="password"
                        name="pin"
                        value={form.pin}
                        onChange={handleChange}
                        placeholder="****"
                        className="border rounded-lg py-3 px-3 bg-black border-indigo-600 placeholder-white-500 text-white"
                        required
                      />
                      <label className="font-bold text-lg text-white">
                        Initial Deposit
                      </label>
                      <input
                        type="text"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Amount in INR"
                        className="border rounded-lg py-3 px-3 mt-4 bg-black border-indigo-600 placeholder-white-500 text-white"
                        required
                      />
                      <button
                        type="submit"
                        className="border border-indigo-600 bg-black text-white rounded-lg py-3 font-semibold"
                      >
                        Create Account
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
