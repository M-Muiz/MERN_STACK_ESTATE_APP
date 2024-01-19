import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";
import { app } from "../firebase";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/user/userSlice';


const GoogleBtn = () => {

  const dispatch = useDispatch();

  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/user/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL,}),
      });

      const data = await res.json();
      dispatch(loginSuccess(data))

    } catch (error) {
      console.log("Could Not Login With Google", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-green-800 p-3 font-semibold text-base text-white rounded-lg hover:opacity-90"
    >
      Continue with Google
    </button>
  );
};

export default GoogleBtn;
