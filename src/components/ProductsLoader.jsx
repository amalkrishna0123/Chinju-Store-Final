import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const ProductsLoader = () => {
  return (
    <div className='flex justify-center items-center h-[80vh] w-full'>
        <DotLottieReact
      src="https://lottie.host/bb27cb24-e84c-4978-a97c-b17256860d33/vcxdSMgf73.lottie"
      loop
      autoplay
      className='w-[150px] h-[150px] object-contain'
    />
    </div>
  )
}

export default ProductsLoader
