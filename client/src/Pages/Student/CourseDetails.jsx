import React, { useContext, useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { Loading } from "../../Components/Students/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import { Footer } from "../../Components/Students/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

export const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState([]);
  const [isAlreadyEnrolled, setisAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const {
    allCourses,
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    currency,
    backendUrl,userData,getToken
  } = useContext(AppContext);

  const fetchCourseData = async () => {
   try{
     
    const {data}=await axios.get(backendUrl + '/api/course/' + id)
    if(data.success){
      setCourseData(data.courseData)
    } else{
      toast.error(data.message)
    }

   } catch (error){
      toast.error(data.message)
   }
  };

  const enrollCourse=async ()=>{
    try{
      if(!userData){
        return toast.warn('Login to Enroll')
      }
      if(isAlreadyEnrolled){
        return toast.warn('Already Enrolled')
      }
      const token = await getToken();

      const {data}=await axios.post(backendUrl+'/api/user/purchase',{courseId:courseData._id},{headers:{Authorization:`Bearer ${token}`}})
      console.log(data)
      if(data.success){
        const {session_url}=data
        window.location.replace(session_url)
    } else{
      toast.error(data.message)
    }
    } catch (error){
      toast.error(error.message)
    }
  }

  useEffect(() => {
   
    fetchCourseData();
   
  },[]);
  useEffect(() => {
   
    if(userData && courseData){
      setisAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
   
  },[userData,courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return courseData ? (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-96 -z-10 bg-gradient-to-b from-cyan-600 to-transparent"></div>

      <div className="bg-gradient-to-b from-cyan-200/50 to-transparent flex flex-col md:flex-row gap-10 relative items-start justify-between lg:px-48 md:px-36 px-8 md:pt-30 pt-20 text-left">
        {/* Left column */}
        <div className="max-w-2xl z-10 text-gray-500">
          <h1 className="lg:text-4xl md:text-4xl text-3xl font-bold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <p
            className="mt-4 text-1xl"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 210),
            }}
          ></p>

          {/* Review and rating */}
          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p className="font-semibold">{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  className="w-4 h-4"
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                />
              ))}
            </div>
            <p className="text-blue-600">
              ({courseData.courseRatings.length}
              {courseData.courseRatings.length > 1 ? " ratings" : " rating"})
            </p>
            <p>
              
              {courseData.enrolledStudents?.length}{" "}
              {courseData.enrolledStudents?.length > 1 ? "Students" : "Student"}
            </p>
          </div>
          <p className="text-sm">
            Course by{" "}
            <span className="text-blue-600 underline">{courseData.educator.name}</span>
          </p>
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded-lg shadow-sm"
                >
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow icon"
                        className={`transform transition-transform ${
                          openSections[index] ? "rotate-180" : ""
                        }`}
                      />
                      <p className="font-medium">{chapter.chapterTitle}</p>
                    </div>
                    <p className="px-4 pb-3 text-sm text-gray-600">
                      {chapter.chapterContent.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`h-20 overflow-hidden transition-all duration-300 ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    } `}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={assets.play_icon}
                            alt="play icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-1xl">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2 ">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Preview
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="py-20 text-sm md:text-xl">
            <h3 className="text-xl font-semibold text-gray-800 ">
              Course Description
            </h3>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            ></p>
          </div>
        </div>

        {/* Right column */}
        <div className=" md:w-1/3 lg:w-1/4 z-10  inset-shadow-zinc-950 rounded-t md:rounded-none overflow-hidden bg-white min-w-[200px] sm:min-w-[330px]">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{
                playerVars: {
                  autoplay: 1,
                },
              }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="" />
          )}
          <div className="p-5">
            <div className="flex items-center gap-2">
              <img
                className="w-3.5"
                src={assets.time_left_clock_icon}
                alt="time left clock icon"
              />
              <p className="text-red-500">
                <span className="font-medium">5 days left at this price</span>
              </p>
            </div>
            <div className="flex gap-3 items-center pt-2">
              <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                {currency}{" "}
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}
              </p>
              <p className="md:text-lg text-gray-500 line-through">
                {currency}
                {courseData.coursePrice}
              </p>
              <p className="md:text-lg text-gray-500">
                {courseData.discount} % off
              </p>
            </div>
            <div className="flex items-center text-sm md:text-xs gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star_icon"></img>
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="clock_icon"></img>
                <p>{calculateCourseDuration(courseData)}</p>
              </div>

              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="star_icon"></img>
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>
            <button onClick={enrollCourse} className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium cursor-pointer">
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">
                What's in the Course
              </p>
              <ul
                className="ml-4 pt-2 text-sm md:text-sm list-disc text-gray-500"
                l
              >
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
                <li>Quizzes to test your knowledge.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loading />
  );
};
