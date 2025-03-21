import React, { useContext, useEffect, useState } from 'react';
import { dummyStudentEnrolled } from '../../assets/assets';
import { Loading } from '../../Components/Students/Loading';
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const StudentEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const {backendUrl,getToken,isEducator}=useContext(AppContext)


  const fetchEnrolledStudents = async () => {
   try{
    const token=await getToken()
    const {data}=await axios.get(backendUrl + '/api/educator/enrolled-students',{headers:{Authorization : `Bearer ${token}`}})
    if(data.success){
      setEnrolledStudents(data.enrolledStudents.reverse())
    } else{
      toast.error(data.message)
    }
   } catch(error){
    toast.error(error.message)
   }
  };

  useEffect(() => {
    if(isEducator){
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col items-start md:p-8 p-4 pt-8'>
      <h2 className='pb-4 text-lg font-medium'>Enrolled Students</h2>
      <div className='w-full overflow-x-auto'>
        <table className='md:table-auto table-fixed w-full border border-gray-200'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
            <tr>
              <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
              <th className='px-4 py-3 font-semibold'>Student Name</th>
              <th className='px-4 py-3 font-semibold'>Course Title</th>
              <th className='px-4 py-3 font-semibold hidden sm:table-cell'>Date</th>
            </tr>
          </thead>
          <tbody className='text-sm text-gray-500'>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                  <img src={item.student.imageUrl} alt='Student' className='w-16 rounded-full' />
                  <span className='truncate hidden md:block'>{item.student.name}</span>
                </td>
               
                <td className='px-4 py-3'>{item.courseTitle}</td>
                <td className='px-4 py-3 hidden sm:table-cell'>{new Date(item.purchaseDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};