import React, { useEffect, useState } from 'react'
import { MdCloudUpload } from "react-icons/md";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from '../firebase';
import { TiWarning } from "react-icons/ti";
import { MdDelete } from "react-icons/md"
import { useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';


const UpdateListing = () => {
    const [percent, setPercent] = useState(0);
    const [data, setData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        regularPrice: 50,
        discountedPrice: 50,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        offer: false,
        type: 'rent'
    });
    const [imageArr, setImageArr] = useState([]);
    const [imageUplpoadError, setImageUploadError] = useState(false);
    const [showPercent, setShowPercent] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`https://mern-stack-estate-app.vercel.app/api/listing/get_listing/${listingId}`);
            const resData = await res.json();
            if (resData.success === false) {
                console.log(resData)
            }
            setData(resData)
        };
        fetchListing();
    }, []);

    const handleImageSubmit = () => {
        if (imageArr.length > 0 && imageArr.length + data.imageUrls.length < 7) {
            const promises = [];
            for (let i = 0; i < imageArr.length; i++) {
                promises.push(uploadImage(imageArr[i]))
            }
            Promise.all(promises).then((urls) => {
                setData({
                    ...data, imageUrls: data.imageUrls.concat(urls),
                })
                setUploading(false)
                setImageUploadError(false)
            }).catch((err) => {
                setUploading(false)
                setImageUploadError("Error image upload failed! (image size should be under 2mb)")
            });
        } else {
            setShowPercent(false)
            setUploading(false)
            setImageUploadError("You can only upload six images per listing")
        }
    };

    const uploadImage = async (file) => {
        setShowPercent(true)
        setUploading(true)
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, `listingImage/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setPercent(Math.round(progress))
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleDelete = (ind) => {
        setData({
            ...data,
            imageUrls: data.imageUrls.filter((_, i) => i !== ind)
        })
    };

    const handleChange = (e) => {
        if (e.target.id === "sell" || e.target.id === "rent") {
            setData({
                ...data,
                type: e.target.id
            })
        }
        if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
            setData({
                ...data,
                [e.target.id]: e.target.checked
            })
        }
        if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
            setData({
                ...data,
                [e.target.id]: e.target.value
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (data.imageUrls.length < 1) return setError("You must upload atleast one image.");
            if (+data.regularPrice < +data.discountedPrice) return setError("Regular price must be grater than discounted price");
            setError(false)
            setLoading(true)
            const res = await fetch(`https://mern-stack-estate-app.vercel.app/api/listing/update_listing/${params.listingId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    userRef: currentUser._id
                }),
            });
            const resData = await res.json();
            setLoading(false);
            if (resData.success === false) {
                setError(resData.message)
            }
            navigate(`/listing/${resData._id}`)
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }
    return (
        <main className='p-2 max-w-6xl mx-auto'>
            <h1 className="text-5xl text-center font-semibold font-mono my-8 heading text-green-800">
                Update Listing
            </h1>
            <form className='flex gap-6 px-4 flex-col sm:flex-row' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Title"
                        className="p-3 rounded-lg text-slate-500 font-medium outline-none
           tracking-wide border border-transparent  focus:border-green-900" id="name" required minLength="10" maxLength="48"
                        onChange={handleChange}
                        defaultValue={data.name}
                    />
                    <textarea
                        type="text"
                        placeholder="Description"
                        className="p-3 rounded-lg text-slate-500 font-medium outline-none
           tracking-wide border border-transparent  focus:border-green-900" id="description" required minLength="10"
                        onChange={handleChange}
                        defaultValue={data.description}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="p-3 rounded-lg text-slate-500 font-medium outline-none
           tracking-wide border border-transparent  focus:border-green-900" id="address" required
                        onChange={handleChange}
                        defaultValue={data.address}
                    />

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2 pop-text font-semibold text-base">
                            <input name='sell' type="checkbox" id="sell" className='w-5 cursor-pointer' onChange={handleChange} checked={data.type === 'sell'} />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2 pop-text font-semibold text-base">
                            <input name='rent' type="checkbox" id="rent" className='w-5 cursor-pointer' onChange={handleChange} checked={data.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2 pop-text font-semibold text-base">
                            <input name='parkingSpot' type="checkbox" id="parking" className='w-5 cursor-pointer' onChange={handleChange} checked={data.parking} />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2 pop-text font-semibold text-base">
                            <input name='furnished' type="checkbox" id="furnished" className='w-5 cursor-pointer' onChange={handleChange} checked={data.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2 pop-text font-semibold text-base">
                            <input name='offer' type="checkbox" id="offer" className='w-5 cursor-pointer' onChange={handleChange} checked={data.offer} />
                            <span>Offer</span>
                        </div>
                    </div>


                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2 pop-text font-semibold text-base items-center">
                            <input type="number" className='w-12 p-2 rounded-lg outline-none border border-gray-300 focus:border-green-900' required min="1" max="12" id="bedrooms" onChange={handleChange} value={data.bedrooms} />
                            <span>Beds</span>
                        </div>
                        <div className="flex gap-2 pop-text font-semibold text-base items-center">
                            <input type="number" className='w-12 p-2 rounded-lg outline-none border border-gray-300 focus:border-green-900' required min="1" max="12" id="bathrooms" onChange={handleChange} value={data.bathrooms} />
                            <span>Baths</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2 pop-text font-semibold text-base items-center">
                            <input type="number" className='w-24 p-2 rounded-lg outline-none border border-gray-300 focus:border-green-900' required min="50" max="10000000" id="regularPrice" onChange={handleChange} value={data.regularPrice} />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                        {data.offer &&
                            <div className="flex gap-2 pop-text font-semibold text-base items-center">
                                <input type="number" className='w-24 p-2 rounded-lg outline-none border border-gray-300 focus:border-green-900' required min="50" max="10000000" id="discountedPrice" onChange={handleChange} value={data.discountedPrice} />
                                <div className="flex flex-col items-center">
                                    <p>Discounted Price</p>
                                    <span className='text-xs'>($ / month)</span>
                                </div>
                            </div>
                        }
                    </div>

                </div>

                <div className="flex flex-col flex-1">
                    <p className='pop-text font-semibold text-xl'>Images: <span className='text-green-900 text-base'>The first image will be the cover (max 6)</span></p>

                    <div className="flex gap-4 mt-2">
                        <input type="file" id="images" accept='image/*' onChange={(e) => setImageArr(e.target.files)} className='p-2 border border-gray-500 rounded-e-lg cursor-pointer' multiple />
                        <button disabled={uploading} type='button' className='flex gap-2 items-center text-lg py-2 px-4 cursor-pointer rounded-lg bg-green-900 text-white hover:opacity-90' onClick={handleImageSubmit}><MdCloudUpload />
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>

                    {imageUplpoadError && <p className="text-red-900 font-semibold flex items-center gap-1 mt-2"> <TiWarning /> {imageUplpoadError}</p>}

                    {data.imageUrls.length > 0 && data.imageUrls.map((url, ind) => (
                        <div className="flex items-center justify-between gap-4 border-gray-500" key={ind}>
                            <img src={url} alt="listing_Image" className='w-36 h-36 object-contain rounded-lg' />
                            <button type='button' onClick={() => handleDelete(ind)} className='"text-red-900 font-semibold cursor-pointer flex items-center'><MdDelete />Delete</button>
                        </div>
                    ))
                    }

                    <button disabled={loading || uploading} className="bg-slate-700 mt-4 p-3 font-semibold text-base text-white rounded-lg hover:opacity-90 disabled:opacity-75">
                        {loading ? "Updating ..." : "Update"}</button>
                    {error && <p className="mt-2 text-red-900 font-semibold flex items-center gap-1"> <TiWarning /> {error}</p>}

                </div>
            </form>
        </main>
    )
}

export default UpdateListing;
