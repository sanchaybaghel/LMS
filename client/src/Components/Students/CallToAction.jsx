import React from 'react';
import { assets } from '../../assets/assets';

export const CallToAction = () => {
  return (
    <div className='p-8 text-center rounded-lg shadow-lg'>
      <h1 className='text-2xl font-semibold text-gray-800 mb-4'>
        Learn anything, anytime, anywhere
      </h1>
      <p className='text-gray-600 mb-6'>
        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.
      </p>
      <div className='flex justify-center gap-4'>
        <button className='px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300'>
          Get Started
        </button>
        <button className='flex items-center px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer'>
          Learn More <img src={assets.arrow_icon} alt='arrow_icon' className='ml-2' />
        </button>
      </div>
    </div>
  );
};