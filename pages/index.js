import { useState } from "react";
import { useRouter } from "next/router";
import nookies from "nookies";
import { admin } from "../firebase/admin";
import Container from "../components/Container";
import Loading from "../components/Loading";
import Post from "../components/Post";

const DUMMY_DATA = [
  {
    src:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80",
    user: {
      username: "spotquan",
      name: "Spot Quan",
    },
  },
  {
    src:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80",
    user: {
      username: "lokkibeans",
      name: "Lokki Beans",
    },
  },
  {
    src:
      "https://images.unsplash.com/photo-1592528855735-14e349c28919?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80",
    user: {
      username: "lunabeans",
      name: "Luna Beans",
    },
  },
];

export const getServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { name } = token;

    return { props: { isLoggedIn: true, posts: [] } };
  } catch (err) {
    ctx.res.writeHead(302, { Location: "/welcome" });
    ctx.res.end();

    return { props: { isLoggedIn: false, posts: [] } };
  }
};

export default function Home({ isLoggedIn, posts }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState(posts);

  const getPosts = async (refresh = false) => {
    setLoading(true);

    if (refresh) {
      setPosts(DUMMY_DATA);
    } else {
      setPosts([...allPosts, DUMMY_DATA]);
    }

    setTimeout(() => setLoading(false), 3000);
  };

  console.log("allPosts", allPosts);

  return (
    <Container>
      {loading && (
        <div className="mt-4">
          <Loading small />
        </div>
      )}
      {posts &&
        posts.map((post) => {
          return <Post post={post} />;
        })}
    </Container>
  );
}
