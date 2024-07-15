import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingCard from "../components/ListingCard"


const Home = () => {

  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [sellListings, setSellListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(false);

console.log(loading)

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        setLoading(true)
        const res = await fetch('https://mern-stack-estate-app.vercel.app/api/listing/get_listings?offer=true&limit=3');
        const offerLists = await res.json()
        fetchRentListing()
        setOfferListings(offerLists)
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(fasle)
      }
    }
    fetchOfferListing();


    const fetchRentListing = async () => {
      try {
        const res = await fetch('https://mern-stack-estate-app.vercel.app/api/listing/get_listings?type=rent&limit=3');
        const rentLists = await res.json()
        fetchSellListing()
        setRentListings(rentLists)
      } catch (err) {
        console.log(err)
      }
    }

    const fetchSellListing = async () => {
      try {
        const res = await fetch('https://mern-stack-estate-app.vercel.app/api/listing/get_listings?type=sell&limit=3');
        const sellLists = await res.json()
        setSellListings(sellLists)
      } catch (err) {
        setLoading(fasle)
        console.log(err)
      }
    }

  }, [])

  return (
    <>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 font-semibold text-gray-700 p-28 px-3">
        <h1 className='text-3xl sm:text-5xl font-bold'>Welcome to <span className='text-green-900'>GlobalEstaes</span></h1>
        <p className='text-gray-600 text-xs md:text-base'>Global Estates will help you to find your home fast, easy and comfortable.<br /> Our expert support are always with you.</p>
        <Link to="/search">
          <button className='hover:underline text-green-900 font-semibold'>Let's Start Now.</button>
        </Link>
      </div>

{
  loading && <div className="w-full flex justify-center items-center gap-1"> 
            <p className='text-6xl font-semibold my-8 heading text-green-800'>Loading</p>
            <div class="h-6 w-6 animate-spin rounded-full border-b-4 border-green-800"/>
    </div>
}

      <Swiper navigation>
        {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div className="h-[550px]" style={{ background: `url('${listing.imageUrls[0]}') center no-repeat`, backgroundSize: "cover" }}>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-lg sm:text-2xl font-bold pop-text">Recent Offers</h2>
              <Link to="/search?offer=true">
                <button className='hover:underline pop-text text-sm text-green-900 font-semibold'>Show More Offers</button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-8">
              {offerListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-lg sm:text-2xl font-bold pop-text">Recent Offers For Rent</h2>
              <Link to="/search?type=rent">
                <button className='hover:underline pop-text text-sm text-green-900 font-semibold'>Show More Rent Offers</button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-8">
              {rentListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {sellListings && sellListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-lg sm:text-2xl font-bold pop-text">Recent Offers For Sell</h2>
              <Link to="/search?type=sell">
                <button className='hover:underline pop-text text-sm text-green-900 font-semibold'>Show More Sells Offers</button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-8">
              {sellListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

      </div>

    </>
  )
}

export default Home;