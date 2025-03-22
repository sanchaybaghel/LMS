import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Context/AppContext';
import { Line } from 'rc-progress';
import { Footer } from '../../Components/Students/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';

export const MyEnrollements = () => {
  const { enrolledCourses, calculateCourseDuration,navigate,userData,fetchUserEnrolledCourses,backendUrl,getToken,calculateNoOfLectures } = useContext(AppContext);
  const getCourseProgress=async ()=>{
    try{
      const token = await getToken();
      const tempProgressArray=await Promise.all(
        enrolledCourses?.map(async (course)=>{
          const {data}=await axios.post(`${backendUrl}/api/user/get-course-progress`,{courseId:course._id},{headers:{Authorization:`Bearer ${token}`}})
          let totalLectures=calculateNoOfLectures(course);
          const lectureCompleted=data.progressData ? data.progressData.lectureCompleted.length : 0;
          return {totalLectures,lectureCompleted}
        })
      )
      setProgressArray(tempProgressArray);
      
    } catch (error){
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    if(userData){
      fetchUserEnrolledCourses()
    }
  },[userData])

  useEffect(()=>{
    if(enrolledCourses?.length > 0){
      getCourseProgress()
    }
  },[enrolledCourses])

  const [progressArray, setProgressArray] = useState([]);

  return (
    <>
      <div className='md:px-36 px-8 pt-10 bg-gradient-to-b from-cyan-50 to-white'>
        <h1 className='text-2xl font-semibold mb-6'>
          My Enrollements
        </h1>
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
            <thead className='bg-gray-200 text-gray-900'>
              <tr>
                <th className='px-6 py-3 font-semibold text-left'>Course</th>
                <th className='px-6 py-3 font-semibold text-left'>Duration</th>
                <th className='px-6 py-3 font-semibold text-left'>Completed</th>
                <th className='px-6 py-3 font-semibold text-left'>Status</th>
              </tr>
            </thead>
            <tbody className='text-gray-700'>
              {enrolledCourses.map((course, index) => (
                <tr key={index} className='border-b border-gray-200 hover:bg-gray-100'>
                  <td className='px-6 py-4 flex items-center space-x-3'>
                    <img src={course.courseThumbnail} alt='' className='w-14 sm:w-24 md:w-28 rounded-lg' />
                    <div className='flex-1'>
                      <p className='mb-1 text-sm font-medium text-gray-900'>{course.courseTitle}</p>
                      <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted *100)/progressArray[index].totalLectures : 0} className='bg-gray-300'/>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    {calculateCourseDuration(course)}
                  </td>
                  <td className='px-6 py-4'>
                    {progressArray[index] && `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}`} <span>Lectures</span>
                  </td>
                  <td className='px-6 py-4'>
                    <button onClick={()=>navigate('/player/'+course._id)} className='px-4 py-2 bg-blue-600 text-white rounded-lg'>
                      {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 ? 'Completed' : 'On Going'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer/>
    </>
  );
};