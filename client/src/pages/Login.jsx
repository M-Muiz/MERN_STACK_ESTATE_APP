import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFail } from "../redux/user/userSlice";
import { TiWarning } from "react-icons/ti";


const Login = () => {
  const [data, setData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const res = await fetch("https://mern-stack-estate-app.vercel.app/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success === false) {
        dispatch(loginFail(resData.message));
        return;
      }
      dispatch(loginSuccess(resData.rest));
      navigate("/");
    } catch (error) {
      dispatch(loginFail(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-5xl text-center font-semibold font-mono mt-10 heading text-green-800">
        Login
      </h1>
      <form className="flex flex-col gap-4 mt-10" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email..."
          required
          pattern="[^ @]*@[^ @]*"
          className="p-3 rounded-lg text-slate-500 font-medium 
                    tracking-wide outline-none border border-transparent  focus:border-green-900"
          id="email"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="password..."
          required
          className="p-3 rounded-lg text-slate-500 font-medium 
                    tracking-wide outline-none border border-transparent  focus:border-green-900"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-500 p-3 font-semibold text-base text-white rounded-lg hover:opacity-70"
        >
          {loading ? "loading..." : "Login"}
        </button>
      </form>
      <div className="mt-5 gap-2 pop-text px-3">
        <p>
          Don't have an account ?
          <Link to={"/register"}>
            <span className="text-green-800 cursor-pointer ml-2">
              Register
            </span>
          </Link>
        </p>
      </div>
      {error && <p className="px-3 text-red-900 font-semibold flex items-center gap-1"> <TiWarning /> {error}</p>}
    </div>
  );
};

export default Login;
