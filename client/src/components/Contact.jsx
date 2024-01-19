import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
console.log(message)
const submitChange = (e)=>{

}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/listing/${listing.userRef}`);
        const resData = await res.json()
        setUserData(resData)
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, [listing.userRef])

  return (
    <>
      {userData && (
        <div className="flex flex-col gap-2">
          <p className='text-lg tracking-wide'>Contact <span className='text-green-800 font-extrabold'>{userData.name}</span> for <span className='text-black-800 font-extrabold'>{listing.name}</span></p>
          <textarea  id="" placeholder='send a message' rows='2' value={message} onChange={(e)=> setMessage(e.target.value)} className='p-3 w-full outline-none border border-green-900 rounded-lg text-slate-500'></textarea>
<Link className="bg-slate-700 text-center p-3 font-semibold text-base text-white rounded-lg tracking-widest hover:opacity-90"
to={`mailto:${userData.email}?subject=Regarding ${userData.name}&body=${message}`}
>
  Send Message
</Link>


        </div>
      )}
    </>
  )
}

export default Contact
