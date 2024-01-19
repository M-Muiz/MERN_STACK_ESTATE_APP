import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SingUp = () => {

  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.id]: e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('https://mern-stack-estate-app.vercel.app/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success === false) {
        setLoading(false)
        setError(resData.message);
        return;
      }
      setLoading(false)
      setError(null);
      navigate("/login")
    }
    catch (error) {
      setLoading(false)
      setError(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-5xl text-center font-semibold font-mono mt-10 heading text-green-800">Register</h1>
      <form className='flex flex-col gap-4 mt-10' onSubmit={handleSubmit}>
        <input type="text" placeholder='username...' className='p-3 rounded-lg text-slate-500 font-medium 
                    tracking-wide outline-none border border-transparent  focus:border-green-900' required id='name' onChange={handleChange} />
        <input type="text" placeholder='email...' required pattern="[^ @]*@[^ @]*" className='p-3 rounded-lg text-slate-500 font-medium 
                    tracking-wide outline-none border border-transparent  focus:border-green-900' id='email' onChange={handleChange} />
        <input type="text" placeholder='password...' required className='p-3 rounded-lg text-slate-500 font-medium 
                    tracking-wide outline-none border border-transparent  focus:border-green-900' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-500 p-3 font-semibold text-xl text-white rounded-lg hover:opacity-90'>
          {loading ? "loading..." : "Register"}
        </button>
      </form>
      <div className="mt-5 gap-2 pop-text px-3">
        <p>Already have an account ?
          <Link to={"/login"}>
            <span className='text-green-800 cursor-pointer ml-2'>Login</span>
          </Link>
        </p>
      </div>
      {error && <p className="px-3 text-red-900 font-semibold">{error}</p>}
    </div>
  )
};

export default SingUp