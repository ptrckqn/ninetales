import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../firebase';
import { useAuth } from '../context/authContext';
import { useNav } from '../context/navContext';
import TextInput from '../components/TextInput';
import Loading from '../components/Loading';
import Button from '../components/Button';

const Search = () => {
  const auth = useAuth();
  const { updateNav, resetNav } = useNav();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [foundUser, setFoundUser] = useState();

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSearch = async () => {
    const docRef = firestore.collection('users').doc(search.toLowerCase());
    const doc = await docRef.get();
    if (search.toLowerCase() !== auth.username && doc.exists) {
      setFoundUser(doc.data());
    } else {
      setFoundUser(false);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    // TODO: Check to see if request exists already
    await firestore.collection('pendingRequests').add({
      source: auth.username,
      target: foundUser.username,
    });

    setSearch('');
    setFoundUser(null);
  };

  useEffect(() => {
    updateNav({ showBack: true, noSearch: true });

    return () => {
      resetNav();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
    }
    let timeout;
    if (search) {
      timeout = setTimeout(() => {
        handleSearch();
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <>
      <div className="p-4">
        <TextInput autoFocus name="search" value={search || ''} handleChange={handleChange} startIcon="/svg/search-2.svg" />
        {search ? (
          loading ? (
            <div className="text-center mt-16">
              <Loading size={4} />
            </div>
          ) : foundUser ? (
            <>
              <div className="mt-8 mb-4 flex justify-center">
                <img src={foundUser.pic || '/svg/user-filled.svg'} className=" h-48 w-48 inset-white rounded-full object-cover" />
              </div>
              <h3 className="font-serif font-bold text-white text-2xl text-center">{foundUser.name}</h3>
              <h6 className="text-lg text-gray-400 text-center">@{foundUser.username}</h6>
              <h6 className="text-lg text-gray-400 text-center">
                {foundUser.friends.length} Friend{foundUser.friends.length === 1 ? '' : 's'}
              </h6>

              <div className="p-4">
                <Button variant="contained" className="mb-2 w-full " handleClick={handleAdd}>
                  Add Friend
                </Button>

                <Link to={`/${foundUser.username}`}>
                  <Button variant="outlined" className="w-full ">
                    View Profile
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <h2 className="font-bold text-3xl text-white mt-16">No user found.</h2>
          )
        ) : (
          <>
            <h2 className="font-bold text-3xl text-white mt-16">Want to read more stories?</h2>
            <h3 className="font-bold text-xl text-white mt-8">Let's search for a friend.</h3>
          </>
        )}
      </div>
    </>
  );
};

export default Search;
