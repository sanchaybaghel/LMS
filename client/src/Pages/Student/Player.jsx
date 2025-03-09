import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import { Footer } from "../../Components/Students/Footer";
import { Rating } from "../../Components/Students/Rating";

export const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
      }
    });
  };

  useEffect(() => {
    getCourseData();
  }, [courseId, enrolledCourses]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <div className="p-4 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:px-36 bg-gradient-to-b from bg-cyan-50">
        {/* left column */}
        <div className="text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Course Structure</h2>
          <div className="pt-5">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-4 rounded-lg shadow-lg"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
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
                      <p className="font-medium text-lg">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="px-4 pb-3 text-sm text-gray-600">
                      {chapter.chapterContent.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-2">
                          <img
                            src={
                              false ? assets.blue_tick_icon : assets.play_icon
                            }
                            alt="play icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-sm md:text-base">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer hover:underline"
                                >
                                  Watch
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
          <div className="flex"> 
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <Rating initialRating={0}/>
          </div>
        </div>
        {/* right column */}
        <div className="flex justify-center items-center">
          {playerData ? (
            <div className="">
              <YouTube
                videoId={playerData.lectureUrl.split("/").pop()}
                opts={{
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex justify-between items-center mt-1">
                <p>{playerData.chapter}.{playerData.lecture}{playerData.lectureTitle}</p>
                <button className="text-blue-600 ">{false ? 'Completed':'Mark Complete'}</button>
              </div>
            </div>
          ) : (
            <img
              src={courseData ? courseData.courseThumbnail : " "}
              alt={
                courseData
                  ? `${courseData.courseTitle} Thumbnail`
                  : "Course Thumbnail"
              }
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};
