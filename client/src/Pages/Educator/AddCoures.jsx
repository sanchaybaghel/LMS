import React, { useEffect, useState, useRef, useContext } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import 'quill/dist/quill.snow.css'; // Import Quill's CSS
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

export const AddCoures = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [chapter, setChapter] = useState([]);
  const [image, setImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter chapter name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapter.length > 0 ? chapter.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapter([...chapter, newChapter]);
      }
    } else if (action === 'remove') {
      setChapter(chapter.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapter(
        chapter.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapter(
        chapter.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapter(
      chapter.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid(),
            isPreview: lectureDetails.isPreviewFree, // Ensure isPreview is included
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        toast.error('Thumbnail not selected');
        return;
      }
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML, // Get HTML content from Quill editor
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapter,
      };
      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      formData.append('image', image);
      const token = await getToken();
      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        setCourseTitle('');
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapter([]);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen overflow-scroll flex flex-col items-start justify-start md:p-8 p-4 pt-8 pb-0 bg-gray-100">
      <h2 className="pb-4 text-2xl font-semibold text-gray-800">Add Course</h2>
      <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 mb-4">
          <label className="font-medium text-gray-700">Course Title</label>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <label className="font-medium text-gray-700">Course Description</label>
          <div ref={editorRef} className="bg-white p-4 rounded border border-gray-300"></div>
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <label className="font-medium text-gray-700">Course Price</label>
          <input
            onChange={(e) => setCoursePrice(e.target.value)}
            value={coursePrice}
            type="number"
            placeholder="Enter price"
            className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <label className="font-medium text-gray-700">Discount</label>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            placeholder="Enter discount"
            className="outline-none py-2 px-3 rounded border border-gray-300 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <label className="font-medium text-gray-700">Course Thumbnail</label>
          <label htmlFor="thumbnailImage" className="cursor-pointer">
            <img src={assets.file_upload_icon} alt="Upload" className="w-12 h-12 mb-2" />
            <input
              type="file"
              id="thumbnailImage"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              hidden
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Thumbnail"
                className="w-32 h-32 object-cover rounded mt-2"
              />
            )}
          </label>
        </div>
        <div>
          {chapter.map((chapter, chapterIndex) => (
            <div key={chapter.chapterId} className="bg-white border rounded-lg mb-4">
              <div className="flex justify-between items-center p-4 border-b">
                <span className="font-semibold">{chapterIndex + 1}. {chapter.chapterTitle}</span>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">{chapter.chapterContent.length} Lectures</span>
                  <img
                    src={assets.dropdown_icon}
                    width={14}
                    alt=""
                    className={`mr-2 cursor-pointer transition-all ${chapter.collapsed ? "-rotate-90" : ""}`}
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                  />
                  <img
                    src={assets.cross_icon}
                    alt=""
                    className="cursor-pointer"
                    onClick={() => handleChapter('remove', chapter.chapterId)}
                  />
                </div>
              </div>
              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="flex justify-between items-center mb-2">
                      <span>
                        {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -{" "}
                        <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                          Link
                        </a>{" "}
                        - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                      </span>
                      <img
                        src={assets.cross_icon}
                        alt=""
                        className="cursor-pointer"
                        onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                      />
                    </div>
                  ))}
                  <div className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2" onClick={() => handleLecture('add', chapter.chapterId)}>
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer" onClick={() => handleChapter('add')}>
            + Add Chapter
          </div>
        </div>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-lg">
              <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
              <div className="mb-2">
                <p>Lecture Title</p>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded py-1 px-2"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-2">
                <p>Duration (minutes)</p>
                <input
                  type="number"
                  className="mt-1 block w-full border rounded py-1 px-2"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-2">
                <p>Lecture URL</p>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded py-1 px-2"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-2 my-4 mb-3">
                <p>Is Preview Free?</p>
                <input
                  type="checkbox"
                  className="mt-1 scale-125"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: e.target.checked,
                    })
                  }
                />
              </div>
              <button onClick={addLecture} type="button" className="w-full bg-blue-400 text-white px-4 py-2 rounded mt-2">
                Add
              </button>
              <img
                onClick={() => setShowPopup(false)}
                src={assets.cross_icon}
                className="absolute top-4 right-4 w-4 cursor-pointer"
                alt=""
              />
            </div>
          </div>
        )}
        <button type="submit" className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
          Add
        </button>
      </form>
    </div>
  );
};