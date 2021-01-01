import { useState, useEffect } from "react";
import Link from "next/link";
import { firestore } from "../firebase/config";
import { useAuth } from "../context/authContext";
import Container from "../components/Container";
import TextInput from "../components/TextInput";
import Loading from "../components/Loading";
import Button from "../components/Button";

const Search = () => {
  const auth = useAuth();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [foundUser, setFoundUser] = useState();

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSearch = async () => {
    const docRef = firestore.collection("users").doc(search.toLowerCase());
    const doc = await docRef.get();
    if (search.toLowerCase() !== auth.username && doc.exists) {
      setFoundUser(doc.data());
    } else {
      setFoundUser(false);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    const res = await fetch("/api/addFriend", {
      method: "POST",
      body: JSON.stringify({ target: foundUser.username }),
    });

    if (res.ok) {
      setSearch("");
      setFoundUser(null);
    }
  };

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
    <Container showBack noSearch>
      <div className="p-4">
        <TextInput autoFocus name="search" value={search || ""} handleChange={handleChange} startIcon="/svg/search-2.svg" />
        {search ? (
          loading ? (
            <div className="text-center mt-16">
              <Loading size={4} />
            </div>
          ) : foundUser ? (
            <>
              <div className="mt-8 mb-4 flex justify-center">
                <img src={foundUser.pic || "/svg/user-filled.svg"} className=" h-48 w-48 inset-white rounded-full object-cover" />
              </div>
              <h3 className="font-serif font-bold text-white text-3xl text-center">{foundUser.name}</h3>
              <h6 className="text-xl text-gray-400 text-center">@{foundUser.username}</h6>
              <h6 className="text-xl text-gray-400 text-center">
                {foundUser.friends.length} Friend{foundUser.friends.length === 1 ? "" : "s"}
              </h6>

              <div className="p-4">
                <Button variant="contained" className="mb-2 w-full " handleClick={handleAdd}>
                  Add Friend
                </Button>

                <Link href={`/${foundUser.username}`}>
                  <a>
                    <Button variant="outlined" className="w-full ">
                      View Profile
                    </Button>
                  </a>
                </Link>
              </div>
            </>
          ) : (
            <h2 className="font-bold text-4xl text-white mt-16">No user found.</h2>
          )
        ) : (
          <>
            <h2 className="font-bold text-4xl text-white mt-16">Want to read more stories?</h2>
            <h3 className="font-bold text-2xl text-white mt-8">Let's search for a friend.</h3>
          </>
        )}
      </div>
    </Container>
  );
};

export default Search;
