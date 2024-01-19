import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TiWarning } from "react-icons/ti";
import ListingCard from '../components/ListingCard';


const Search = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebardata, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {

      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl || 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });

    };



    const fetchListing = async () => {
      setLoading(true);
      setShowMore(false)
      const searchQuery = urlParams.toString();
      const res = await fetch(`https://mern-stack-estate-app.vercel.app/api/listing/get_listings?${searchQuery}`);
      const resData = await res.json();
      if (resData.length > 8) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
      setListings(resData);
      setLoading(false);
    };

    fetchListing();

  }, [location.search])


  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sell') {
      setSidebarData({
        ...sidebardata, type: e.target.id
      })
    }
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebardata, searchTerm: e.target.value })
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebardata,
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false
      })
    }

    if (e.target.id === 'sort_order') {

      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebarData({ ...sidebardata, sort, order });

    }

  };


  const handleSubmit = (e => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  });

  const showMoreListing = async () => {
    const numberOfListing = listings.length;
    const startIndex = numberOfListing;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex)
    const searchQuery = urlParams.toString();
    const res = await fetch(`https://mern-stack-estate-app.vercel.app/api/listing/get?${searchQuery}`);
    const resData = await res.json();
    if (resData.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...resData])
  }

  return (
    <div className='flex flex-col pop-text md:flex-row'>
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className='flex flex-col gap-8 p-3'>
          <div className="flex items-center gap-2">
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input type="text" id="searchTerm" placeholder='Search...' className='p-3 border rounded-lg w-full outline-none focus:border-green-800' value={sidebardata.searchTerm} onChange={handleChange} />
          </div>
          <div className="flex items-center flex-wrap gap-3">
            <label className='font-semibold'>Type:</label>
            <div className="flex  gap-2">
              <input type="checkbox" id="all" className='w-5' onChange={handleChange} checked={sidebardata.type === 'all'} />
              <span>Rent & Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className='w-5' onChange={handleChange} checked={sidebardata.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className='w-5' onChange={handleChange} checked={sidebardata.type === 'sell'} />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={sidebardata.offer} />
              <span>offer</span>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-3">
            <label className='font-semibold'>Amenities:</label>
            <div className="flex  gap-2">
              <input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={sidebardata.parking} />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={sidebardata.furnished} />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className='font-semibold'>Sort:</label>
            <select id='sort_order' className='border cursor-pointer outline-none rounded-lg p-3'
              defaultValue={'created_at_desc'}
              onChange={handleChange}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button disabled={loading} className="bg-slate-700 p-3 font-semibold text-base text-white rounded-lg hover:opacity-95">
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-5xl text-center md:text-left font-semibold font-mono my-8 heading text-green-800 border-b p-3">
          Listings Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className='text-2xl font-semibold text-red-900 flex items-center gap-1'><TiWarning />No Listings Found :</p>
          )}

          {loading &&
            <p className='text-2xl font-semibold text-slate-700 w-full text-center'>Loading...</p>
          }

          {!loading && listings && listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))

          }
        </div>
        {showMore &&
          <p onClick={showMoreListing} className='text-green-900 text-lg font-semibold py-4 pl-7 cursor-pointer text-center w-full hover:underline'>Show More...</p>
        }

      </div>
    </div>
  )
}

export default Search
