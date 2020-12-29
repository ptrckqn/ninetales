import { useState, useEffect } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";
import { admin, firestore } from "../firebase/admin";
import { firebase } from "../firebase/config";
import Container from "../components/Container";
import Loading from "../components/Loading";
import Post from "../components/Post";

export const getServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { name } = token;

    const friends = await new Promise((resolve, reject) => {
      try {
        firestore
          .collection("users")
          .doc(name)
          .get()
          .then((doc) => {
            const { friends } = doc.data();
            resolve(friends);
          });
      } catch (err) {
        reject(err);
      }
    });

    const posts = await new Promise((resolve, reject) => {
      try {
        firestore
          .collection("posts")
          .where("username", "in", [...friends, name])
          .orderBy("createdAt", "desc")
          .limit(10)
          .get()
          .then((snapshot) => {
            const posts = [];
            snapshot.forEach((doc) => {
              const { createdAt, story, url, username } = doc.data();
              posts.push({ id: doc.id, createdAt, story, url, username });
            });

            resolve(posts);
          });
      } catch (err) {
        reject(err);
      }
    });

    return { props: { posts } };
  } catch (err) {
    ctx.res.statusMessage = err;
    ctx.res.writeHead(302, { Location: "/welcome" });
    ctx.res.end();

    return { props: { posts: [] } };
  }
};

export default function Home({ posts }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(posts);

  const getPosts = async (refresh = false) => {
    setLoading(true);

    // if (refresh) {
    //   setPosts(DUMMY_DATA);
    // } else {
    //   setPosts([...allPosts, DUMMY_DATA]);
    // }

    setLoading(false);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        router.push("/welcome");
      }
    });
  }, []);

  return (
    <Container>
      {loading && (
        <div className="mt-4">
          <Loading small />
        </div>
      )}
      {allPosts &&
        allPosts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
    </Container>
  );
}
