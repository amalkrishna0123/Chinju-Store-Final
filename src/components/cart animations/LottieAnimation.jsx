import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LottieAnimation = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center fixed top-0 bottom-0 left-0 right-0 z-[99999]">
      <DotLottieReact
        src="https://lottie.host/400ae3da-6fcb-4888-a5ea-2b457be98675/uno5pbnDVC.lottie"
        autoplay
        loop
        style={{ width: '300px', height: '300px' }}
      />
    </div>
  );
};

export default LottieAnimation;