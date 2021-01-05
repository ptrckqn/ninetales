import { useRef, useEffect } from "react";
import Post from "../Post";

const Posts = ({ posts, handleLoadMore }) => {
  const loadMore = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(handleLoadMore, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (loadMore.current) {
      observer.observe(loadMore.current);
    }

    return () => {
      if (loadMore.current) observer.unobserve(loadMore.current);
    };
  }, [handleLoadMore]);

  return (
    <div>
      {posts && (
        <>
          {posts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
          <div ref={loadMore} />
        </>
      )}
    </div>
  );
};

export default Posts;
