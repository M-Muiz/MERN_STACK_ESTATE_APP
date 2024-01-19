import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBed, FaBath } from "react-icons/fa"

const ListingCard = ({ listing }) => {
    return (
        <div className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg relative overflow-hidden w-full md:w-[330px]">
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing-cover" className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-all duration-300" />
                <div className="p-3 flex flex-col gap-3">
                    <p className="text-gray-700 font-semibold text-xl truncate">{listing.name}</p>
                    <div className="flex items-center gap-1 text-sm">
                        <MdLocationOn className="text-green-900" />
                        {listing.address}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{listing.description}</p>

                    <p className="text-lg font-semibold text-slate-700">${listing.offer ? listing.discountedPrice.toLocaleString("en-us") : listing.regularPrice.toLocaleString("en-us")} {listing.type === "rent" && '/ Month'}</p>
                    <div className="flex items-center gap-4 font-semibold text-base">
                        <p className="flex items-center gap-1">{listing.bedrooms} <span className="text-green-900"><FaBed /></span></p>
                        <p className="flex items-center gap-1">{listing.bathrooms} <span className="text-green-900"><FaBath /></span></p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ListingCard
