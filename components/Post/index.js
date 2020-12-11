import { useState, useRef } from "react";
import Link from "next/link";

const Post = ({ post: { src, user } }) => {
  const userEle = useRef(null);
  const [showUser, setShowUser] = useState(false);

  const handleClick = () => {
    setShowUser(!showUser);
  };

  const dotClasses = "bg-white h-2 w-2 rounded-full inline-block";
  return (
    <div className="relative w-full max-h-screen-3/4 py-1 bg-white">
      <img src={src} onClick={handleClick} />

      {/* User Label */}
      <div
        ref={userEle}
        className={`p-2 z-20 rounded-full frosted flex items-center w-3/4 transition-opacity ${showUser ? "opacity-100" : "opacity-0"}`}
      >
        <img src="/svg/user-filled.svg" className="h-12 w-12 inset-white rounded-full" />

        <div className={`mx-2 flex-1 ${showUser ? "pointer-events-auto" : "pointer-events-none"}`}>
          <Link href={`/${user.username}`}>
            <a>
              <h3 className="font-serif font-bold text-white truncate">{user.name}</h3>
              <h6 className="text-xs text-gray-400">@{user.username}</h6>
            </a>
          </Link>
        </div>
        <div className="mr-2">
          <button>
            <div className={dotClasses} />
            <div className={`${dotClasses} mx-1`} />
            <div className={dotClasses} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
