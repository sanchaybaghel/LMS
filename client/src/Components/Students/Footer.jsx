import React from 'react';
import { assets } from '../../assets/assets';

export const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-row md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
          <img className='w-32 h-auto mb-4 rounded-full' src={assets.logo} alt='logo'></img>
          <p className='text-white text-sm'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h3 className='text-white text-lg mb-4'>Company</h3>
          <ul className='text-white text-sm space-y-2'>
            <li><a href='#' className='hover:underline'>Home</a></li>
            <li><a href='#' className='hover:underline'>About</a></li>
            <li><a href='#' className='hover:underline'>Courses</a></li>
            <li><a href='#' className='hover:underline'>Privacy Policy</a></li>
          </ul>
        </div>
        <div className='hidden md:flex flex-col itmes-start w-full'>
          <h2 className='text-white font-semibold mb-5'>Subscribe to your Newsletter</h2>
          <p className='text-sm text-white/80'>The latest news, articles, and resources, sent to your inbox weekly</p>
          <div className='flex items-center gap-2 pt-4'>
        <input type='email' placeholder='Enter your email' className='border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'/>
        <button className='bg-blue-600 w-24 h-9 text-white rounded'>Subscribe</button>
      </div>
        </div>
      </div>
      <p className='text-white text-center mt-4'>Copyright 2024 © Skill Matrix. All Right Reserved.</p>
      
    </footer>
  );
};