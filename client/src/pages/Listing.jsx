import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { TiWarning } from "react-icons/ti";
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa"
import { useSelector } from "react-redux";
import Contact from '../components/Contact';

const Listing = () => {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [listing, setListing] = useState(null);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const listingId = params.listingId;
                const res = await fetch(`https://mern-stack-estate-app.vercel.app/api/listing/get_listing/${listingId}`);
                const resData = await res.json();
                if (resData.success === false) {
                    setLoading(false)
                    setError(true)
                    return;
                }
                setLoading(false)
                setError(false)
                setListing(resData)
            } catch (error) {
                setError(true)
            }
        }
        fetchListing();
    }, [params.listingId]);
    return (
        <main>
            {loading && <h1 className="text-5xl text-center font-semibold font-mono my-8 heading text-green-800">
                Loading...
            </h1>}
            {error && <p className="text-red-900 text-2xl font-mono font-semibold flex items-center justify-center mt-4 gap-1"> <TiWarning /> Someting went Wrong!</p>}
            {listing && !error && !loading && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[550px]" style={{ background: `url('${url}') center no-repeat`, backgroundSize: "cover" }}>
                                </div>
                            </SwiperSlide>
                        ))}
                        <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                            <FaShare
                                className='text-slate-500'
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setCopied(true);
                                    setTimeout(() => {
                                        setCopied(false);
                                    }, 2000);
                                }}
                            />
                        </div>
                        {copied && (
                            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                                Link copied!
                            </p>
                        )}
                    </Swiper>

                    <div className='flex flex-col max-w-5xl pop-text mx-auto p-3 my-4 gap-4'>
                        <p className='text-2xl font-semibold'>
                            {listing.name} - ${' '}
                            {listing.offer
                                ? listing.discountedPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className='flex items-center mt-4 gap-2 text-slate-700 text-sm'>
                            <FaMapMarkerAlt className='text-green-800' />
                            {listing.address}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    ${+listing.regularPrice - +listing.discountedPrice} OFF
                                </p>
                            )}
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className='text-green-800 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} beds `
                                    : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths `
                                    : `${listing.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button
                                onClick={() => setContact(true)}
                                className="bg-slate-700 p-3 font-semibold text-base text-white rounded-lg tracking-widest hover:opacity-90"
                            >
                                Contact Landlord
                            </button>
                         )} 
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            )}
        </main>
    )
}

export default Listing


