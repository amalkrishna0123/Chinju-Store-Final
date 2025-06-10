import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const HomeLoader = () => {
  return (
    <div className="h-[500px] w-full flex flex-col justify-center items-center">
      <div className="w-auto h-[80px]">
        <DotLottieReact
          src="https://lottie.host/48484ad2-3f58-4ac0-be18-2ee27984dd9b/iEBI4kb6Sn.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}

export default HomeLoader
