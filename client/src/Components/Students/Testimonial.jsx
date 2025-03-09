import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';
import { Link } from 'react-router-dom';

export const Testimonial = () => {
  return (
    <div className='pb-14 px-8 md:px-0 '>
      <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3'>
        Hear from our learners as they share their journeys of transformation, success, and how our <br />
        platform has made a difference in their lives.
      </p>
      <div className='grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-8 mt-14'>
        {dummyTestimonial.map((testimonial, index) => (
          <div
            className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px] overflow-hidden shadow-black/5 transition-transform duration-300 ease-in-out hover:translate-y-2'
            key={index}
          >
            <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
              <img className='h-12 w-12 rounded-full' src={testimonial.image} alt={testimonial.name} />
              <div>
                <h1 className='text-lg font-medium text-gray-800'>{testimonial.name}</h1>
                <p className='text-gray-800/80'>{testimonial.role}</p>
              </div>
            </div>
            <div className='p-5 pb-7'>
              <div className='flex gap-0.5'>
                {[...Array(5)].map((_, i) => (
                  <img
                    className='h-5'
                    key={i}
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt='star'
                  />
                ))}
              </div>
              <p className='text-gray-500 mt-5'>{testimonial.feedback}</p>
            </div>
            <Link className='text-blue-500 ml-2' to={`/testimonial/${testimonial.id}`}>Read More</Link>
          </div>
        ))}
      </div>
    </div>
  );
};