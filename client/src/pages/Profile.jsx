import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { updateUserFail, updateUserStart, updateUserSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, logOutStart, logOutSuccess, logOutFail } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { TiWarning } from "react-icons/ti";
import { IoMdLogOut } from "react-icons/io";
import { MdDelete, MdOutlineDownloading } from "react-icons/md";
import TopLoadingBar from "../components/TopLoadingBar";
import { FaListUl, FaRegEdit } from "react-icons/fa";


const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [data, setData] = useState({});
  const [file, setFile] = useState(undefined);
  const [percent, setPercent] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [hideError, setHideError] = useState(false);
  const fileRef = useRef(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const dispatch = useDispatch()



  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    setHideError(false)
    if (file) handleFileUpload(file);

  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = currentUser._id;
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(Math.round(progress));
      },
      (error) => {
        setUploadError(true);
        setHideError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setData({ ...data, avatar: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`https://mern-stack-estate-app.vercel.app/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.parse(localStorage.getItem('access_token'))
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success === false) {
        dispatch(updateUserFail(resData.message));
        return;
      }
      dispatch(updateUserSuccess(resData));
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error)
      dispatch(updateUserFail(error.message))
    }
  }

  const handleLogOut = async () => {
    try {
      dispatch(logOutStart())
      const res = await fetch("https://mern-stack-estate-app.vercel.app/api/user/logout");
      const data = await res.json()
      if (data.success === false) {
        dispatch(logOutFail(data.message))
        return;
      }
      dispatch(logOutSuccess(data))
    } catch (error) {
      dispatch(logOutFail(error.message))
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`https://mern-stack-estate-app.vercel.app/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }

  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`https://mern-stack-estate-app.vercel.app/api/listing/show_user_listing/${currentUser._id}`);
      const resData = await res.json();
      if (resData.success === false) {
        setShowListingError(true)
        return
      };
      if (resData.message === undefined) {
        setShowListingError(true);
      }
      setUserListing(resData);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (list_id) => {
    try {
      const res = await fetch(`https://mern-stack-estate-app.vercel.app/api/listing/delete_listing/${list_id}`, {
        method: "DELETE"
      });
      const resData = await res.json();
      if (resData.success === false) {
        console.log(resData.message)
        return
      }
      setUserListing((prev) => prev.filter((listing) => listing._id !== list_id));
    } catch (error) {
      console.log(error.message)
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <TopLoadingBar progress={percent} />
      <h1 className="text-5xl text-center font-semibold font-mono my-8 heading text-green-800">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover self-center cursor-pointer mt-4"
          src={data.avatar || currentUser.avatar}
          alt="avatar"
        />


        <p className="text-sm self-center">
          {uploadError && hideError ? (
            <span className="text-red-900 font-semibold flex items-center">
              <TiWarning /> Error image upload failed! (image size should be under 2mb)
            </span>
          ) : percent > 0 && percent < 100 ? (
            <span className="text-slate-500 font-semibold flex items-center">
              <MdOutlineDownloading />{`Uploading ${percent}%`}
            </span>
          ) : percent === 100 ? (
            <span className="text-green-800 font-semibold flex items-center">
              <IoMdCheckmarkCircleOutline /> Image Uploaded Successfully!
            </span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username..."
          className="p-3 rounded-lg text-slate-500 font-medium 
            tracking-wide outline-none border border-transparent  focus:border-green-900"
          id="name"
          defaultValue={currentUser.name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email..."
          defaultValue={currentUser.email}
          className="p-3 rounded-lg text-slate-500 font-medium outline-none
                    tracking-wide border border-transparent  focus:border-green-900"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password..."
          className="p-3 rounded-lg text-slate-500 font-medium 
                    tracking-wide outline-none border border-transparent  focus:border-green-900"
          id="password"
          onChange={handleChange}
        />

        <button disabled={loading} className="bg-slate-700 p-3 font-semibold text-base text-white rounded-lg hover:opacity-90">
          {loading ? 'Loading...' : 'Update'}
        </button>

        <Link to={"/create_lisitng"} className="bg-green-800 text-base p-3 text-center font-semibold text-white rounded-lg hover:opacity-90">
          Create a Listing
        </Link>
      </form>
      <div className="flex place-content-center justify-between py-3">
        <span onClick={handleDelete} className="text-red-900 font-semibold cursor-pointer flex items-center">
          <MdDelete /> Delete Account
        </span>
        <span onClick={handleLogOut} className="text-red-900 font-semibold cursor-pointer flex items-center">
          <IoMdLogOut /> Log Out
        </span>
      </div>
      {error && <p className="text-red-900 text-sm pop-text font-semibold flex items-center gap-1"> <TiWarning /> {error}</p>}
      {updateSuccess && <p className='text-green-800 text-sm font-semibold pop-text flex items-center gap-1'>
        <IoMdCheckmarkCircleOutline /> User is updated successfully!
      </p>}

      <p onClick={handleShowListing} className="text-green-800 mt-2 font-semibold pop-text flex items-center justify-center  gap-1 cursor-pointer hover:underline active:underline"><FaListUl /> Show Listing</p>
      {showListingError && <p className="text-red-900 pop-text font-semibold flex items-center gap-1"> <TiWarning /> Error in showing listing!</p>}



      {userListing && userListing.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl text-center font-semibold font-mono mt-6 heading text-green-800">Your Listings</h1>
          {userListing.map((listing) => (
            <div key={listing._id} className="border border-gray-200 rounded-lg flex justify-between items-center p-2 gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing_image" className="h-24 w-24 object-contain rounded-lg" />
              </Link>
              <Link className="pop-text text-slate-500 text-xl flex-1 font-semibold hover:underline truncate" to={`/listing/${listing._id}`}>
                <span>{listing.name}</span>
              </Link>


              <div className="flex flex-col gap-1">
                <Link to={`/update_listing/${listing._id}`}>
                  <p className="text-green-800 mt-1 font-semibold pop-text flex items-center gap-1 hover:opacity-80 cursor-pointer" ><FaRegEdit />Edit</p>
                </Link>
                <p className="text-red-900 pop-text font-semibold flex items-center gap-1 hover:opacity-80 cursor-pointer" onClick={() => handleListingDelete(listing._id)}><MdDelete />
                  Delete</p>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default Profile;
