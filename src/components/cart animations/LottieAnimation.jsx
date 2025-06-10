import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ff from "../../assets/ff.png"

const LottieAnimation = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center fixed top-0 bottom-0 left-0 right-0 z-[99999]">
      <div className=' absolute top-0 bottom-0 left-0 right-0 w-full h-full'>
        <img src={ff} alt="" className='w-full h-full object-cover opacity-15'/>
      </div>
      <DotLottieReact
        src="https://lottie.host/400ae3da-6fcb-4888-a5ea-2b457be98675/uno5pbnDVC.lottie"
        autoplay
        loop
        style={{ width: '300px', height: '300px' }}
      />
      <div className=' absolute mt-[200px]'>
        <div className='LogoFont text-3xl font-bold  drop-shadow-sm text-center bg-gradient-to-r from-[#1a7e74] to-[#004d45] text-transparent bg-clip-text'>Chinju Store</div>
      <div className='text-center commonFont text-sm'>Your Neighbourhood Store, Online</div>
      </div>
    </div>
  );
};

export default LottieAnimation;