import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../../firebase';

const Post = ({ post: { story, url, username } }) => {
  const userEle = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [user, setUser] = useState({
    pic: null,
    username: null,
    name: null,
  });

  const paragraphs = useMemo(() => {
    if (!story) return null;
    return story.split('\n').filter((p) => Boolean(p));
  }, [story]);

  const handleClick = () => {
    if (!open) {
      setShowUser(!showUser);
    }
  };

  const handleOpen = (state) => () => {
    if (state) {
      setShowUser(false);
    }
    setOpen(state);
  };

  useEffect(() => {
    const docRef = firestore.collection('users').doc(username);

    docRef.get().then((doc) => {
      const { username, name, pic } = doc.data();

      setUser({ username, name, pic });
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset';
  }, [open]);

  const dotClasses = 'bg-white h-2 w-2 rounded-full inline-block';
  return (
    <>
      <div className={`relative w-full max-h-screen-3/4 py-1 ${loaded ? 'bg-white' : 'bg-gray-700'}`}>
        <div className={`w-full h-96 bg-gray-900 animate-pulse ${loaded ? 'hidden' : 'block'}`} />
        <img className={`${loaded ? 'block' : 'hidden'}`} src={url} onClick={handleClick} onLoad={() => setLoaded(true)} />

        {/* User Label */}
        <div ref={userEle} className={`p-2 z-20 rounded-full frosted flex items-center w-3/4 transition-opacity ${showUser ? 'opacity-100' : 'opacity-0'}`}>
          <img src={user.pic || '/svg/user-filled.svg'} className="h-12 w-12 inset-white rounded-full object-cover" />

          <div className={`mx-2 flex-1 ${showUser ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <Link to={`/${username}`}>
              <h3 className="font-serif font-bold text-white truncate">{user.name}</h3>
              <h6 className="text-xs text-gray-400">@{user.username}</h6>
            </Link>
          </div>
          <div className="mr-2">
            <button onClick={handleOpen(true)}>
              <div className={dotClasses} />
              <div className={`${dotClasses} mx-1`} />
              <div className={dotClasses} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="z-50 fixed bottom-0 w-full h-5/6 frosted-body py-4 rounded-t-lg">
          <span className="block h-1 w-20 bg-gray-200 rounded-full mx-auto" onClick={handleOpen(false)} />
          <div className="flex mt-4 mx-4 items-center">
            <img src={user.pic || '/svg/user-filled.svg'} className="h-16 w-16 inset-white rounded-full object-cover" />

            <div className={`mx-2 flex-1 ${showUser ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              <Link to={`/${username}`}>
                <h3 className="font-serif font-bold text-white text-xl truncate">{user.name}</h3>
                <h6 className="text-lg text-gray-400">@{user.username}</h6>
              </Link>
            </div>
          </div>

          <span className="my-4 ml-4 block h-1 w-24 bg-orange-main rounded-full" onClick={handleOpen(false)} />
          <div className="fade-overflow  h-3/4">
            <div className="text-white text-sm overflow-scroll h-full px-4">
              {paragraphs &&
                paragraphs.map((paragraph, i) => (
                  <p key={i} className="mb-6">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
