import React from 'react'
import ff from "../assets/ff.png";
import fff from "../assets/fff.jpg";
import { AiOutlineInstagram } from "react-icons/ai";
import { PiFacebookLogoBold } from "react-icons/pi";
import { IoLogoWhatsapp } from "react-icons/io5";

const Footer = () => {
  return (
    <div>
      <div className="bg-gray-100 mt-5  text-gray-700 relative">
              <div className="absolute bg-[#219085] top-0 bottom-0 left-0 right-0"></div>
              <div className="absolute top-0 bottom-0 left-0 right-0">
                <img
                  src={ff}
                  alt=""
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
              <div className="backdrop-blur-[1px] h-full relative">
                <div className="max-w-6xl mx-auto py-8 px-5 flex flex-col md:flex-row justify-between gap-6">
                  {/* Logo and Social */}
                  <div className="flex flex-col gap-4">
                    <div className="text-2xl font-semibold text-[#ffffff] LogoFont">
                      Chinju Store
                    </div>
                    <div className="flex items-center gap-4 text-[#ffffff] text-xl">
                      <a
                        href="#"
                        className="hover:text-[#219085] transition-colors duration-200"
                      >
                        <AiOutlineInstagram />
                      </a>
                      <a
                        href="#"
                        className="hover:text-[#219085] transition-colors duration-200"
                      >
                        <PiFacebookLogoBold />
                      </a>
                      <a
                        href="#"
                        className="hover:text-[#219085] transition-colors duration-200"
                      >
                        <IoLogoWhatsapp />
                      </a>
                    </div>
                  </div>
      
                  {/* Info or Links Section (optional for future expansion) */}
                  <div className="flex flex-col items-start text-sm text-[#fff]">
                    <a href="/shippingdelivery" className="hover:underline py-1">
                      Shipping & Delivery
                    </a>
                    <a href="/privacypolicy" className="hover:underline py-1">
                      Privacy Policy
                    </a>
                    <a
                      href="/cancellationRefundpolicy"
                      className="hover:underline py-1"
                    >
                      Cancellation & Refund Policy
                    </a>
                    <a href="/termsandconditions" className="hover:underline py-1">
                      Terms & Conditions
                    </a>
                    <a href="/contact" className="hover:underline py-1">
                      Contact Us
                    </a>
                  </div>
      
                  {/* Copyright */}
                  <div className="text-sm text-[#eee] md:text-right flex justify-start">
                    <p>© 2025 Chinju Store</p>
                    <p>All rights reserved</p>
                  </div>
                </div>
              </div>
            </div>
    </div>
  )
}

export default Footer
