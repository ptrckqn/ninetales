import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import { firebase } from "../firebase/config";
import { useAuth } from "../context/authContext";
import { useGetPosts } from "../hooks/useGetPosts";
import Container from "../components/Container";
import Loading from "../components/Loading";
import Post from "../components/Post";
import Splash from "../components/Splash";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();
  const { getInitialPosts, getMorePosts } = useGetPosts();
  const [splash, setSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [lastPost, setLastPost] = useState();
  const loadMore = useRef(null);

  const fetchPosts = async (refresh) => {
    const usernames = [auth.username, ...auth.friends];

    let newLastPost;
    if (refresh) {
      const { posts, last } = await getInitialPosts(usernames);
      setAllPosts(posts);
      newLastPost = last;
    } else {
      console.log("I JUST RAAAAAN");
      const { posts, last } = await getMorePosts(usernames, lastPost);
      setAllPosts([...allPosts, posts]);
      newLastPost = last;
    }

    setLastPost(newLastPost);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        router.push("/welcome");
      } else {
        setSplash(false);
      }
    });

    const observer = new IntersectionObserver(() => fetchPosts(false), {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });
    if (loadMore.current) {
      observer.observe(loadMore.current);
    }
  }, []);

  useEffect(() => {
    if (auth && isEmpty(allPosts)) {
      fetchPosts(true);
    }
  }, [auth]);

  if (splash) return <Splash />;

  return (
    <Container>
      {loading && (
        <div className="mt-4">
          <Loading small />
        </div>
      )}
      {allPosts && (
        <>
          {allPosts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
          <div ref={loadMore} />
        </>
      )}
    </Container>
  );
}
