import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const Header = () => {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }

    }, [window.location.search]);

    return (
        <header className="bg-slate-300 shadow-md">
            <div className="flex items-center place-content-between p-3 max-w-7xl mx-auto">

                <Link to={"/"}>
                    <h1 className="font-semibold text-sm sm:text-xl flex flex-wrap">
                        <span className='text-green-800'>Global</span>
                        <span className='text-slate-500'>Estates</span>
                    </h1>
                </Link>

                <form onClick={handleSubmit} className='bg-slate-100 rounded-lg flex items-center p-3 ml-12'>
                    <input type="text" className='bg-transparent w-24 sm:w-80 text-slate-500 font-medium  tracking-wide focus:outline-none' placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <button>
                        <FaSearch className='text-green-800 cursor-pointer' />
                    </button>
                </form>
                <ul className='flex gap-4 text-base cursor-pointer font-semibold'>
                    <Link to={"/"}>
                        <li className=' hidden sm:inline-block hover:text-green-800'>Home</li>
                    </Link>
                    <Link to={"/about"}>
                        <li className='hover:text-green-800 text-slate-500'>About</li>
                    </Link>
                    <Link to={"/profile"}>
                        {currentUser ? (
                            <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
                        ) : (
                            <li className='hover:text-green-800 text-slate-500'>Login</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}

export default Header


// w-24 