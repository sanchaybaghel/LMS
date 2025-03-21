import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { Loading } from "../../Components/Students/Loading";
import axios from "axios";
import { toast } from "react-toastify";

export const MyCourse = () => {
  const { currency, backendUrl,isEducator,getToken } = useContext(AppContext);

  const [courses, setCourses] = useState(null);

  useEffect(() => {
    if(isEducator){
      fetchEducatorCourses()
    }
  }, [isEducator]);
 const fetchEducatorCourses=async ()=>{
   try{
    const token=await getToken();
    const {data}=await axios.get(backendUrl + '/api/educator/courses',{headers:{Authorization:`Bearer ${token}`}})
    data.success && setCourses(data.courses)
   } catch(error){
    toast.error(error.message)
   }
 }


  return courses ? (
    <div className="min-h-screen flex flex-col items-start md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <h2 className="pb-4 text-lg font-medium">My Courses</h2>
      <div className="w-full overflow-x-auto">
        <table className="md:table-auto table-fixed w-full overflow-hidden border border-gray-200">
        <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">All Courses</th>
              <th className="px-4 py-3 font-semibold truncate">Earnings</th>
              <th className="px-4 py-3 font-semibold truncate">Students</th>
              <th className="px-4 py-3 font-semibold truncate">Published On</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
              {courses.map((courses)=>(
                <tr key={courses._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img src={courses.courseThumbnail} alt="Course Image" className="w-16"/>
                    <span className="truncate hidden md:block">{courses.courseTitle}</span>
                  </td>
                  <td className="px-4 py-3">{currency} {Math.floor(courses.enrolledStudents.length * (courses.coursePrice-courses.discount * courses.coursePrice /100))}</td>
                  <td className="px-4 py-3">{courses.enrolledStudents.length}</td>
                  <td className="px-4 py-3">{new Date(courses.createdAt).toLocaleString()}</td>
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