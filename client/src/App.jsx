import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import {Home} from './Pages/Student/Home'
import {CourseList} from './Pages/Student/CourseList'
import {CourseDetails} from './Pages/Student/CourseDetails'
import { MyEnrollements } from './Pages/Student/MyEnrollement'
import {Player} from './Pages/Student/Player'
import {Loading} from './Components/Students/Loading'
import {Educator} from './Pages/Educator/Educator'
import {DashBoard} from './Pages/Educator/DashBoard'
import {StudentEnrolled} from './Pages/Educator/StudentEnrolled'
import {MyCourse} from './Pages/Educator/MyCourse'
import {AddCoures} from './Pages/Educator/AddCoures'
import { Navbar } from './Components/Students/Navbar'
import 'quill/dist/quill.snow.css';
import { ToastContainer } from 'react-toastify';
export const App = () => {
  const isEducatorRoute=useMatch('/educator/*');
  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer/>
      {!isEducatorRoute && <Navbar/>}
      
      <Routes>
        <Route path='/' element={<Home/>} />

        <Route path='/course-list' element={<CourseList/>} />
        <Route path='/course-list/:input' element={<CourseList/>} />
        <Route path='/course/:id' element={<CourseDetails/>}/>
        <Route path='/my-enrollments' element={<MyEnrollements/>}/>
        <Route path='Player/:courseId' element={<Player/>} />
        <Route path='/loading/:path' element={<Loading/>} />
        <Route path='/educator' element={<Educator/>}>
          <Route path='/educator' element={<DashBoard />} />
          <Route path='add-course' element={<AddCoures />} />
          <Route path='my-courses' element={<MyCourse/>} />
          <Route path='student-enrolled' element={<StudentEnrolled />} />

        </Route>
      </Routes>
    </div>
  )
}
