import { useState } from "react";
import nookies from "nookies";
import { admin, firestore } from "../firebase/admin";
import { firebase } from "../firebase/config";
import Container from "../components/Container";
import Post from "../components/Post";
import Button from "../components/Button";

export const getServerSideProps = async (ctx) => {
  let isOwner;
  try {
    const cookies = nookies.get(ctx);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { name } = token;

    isOwner = name === ctx.params.username;
  } catch (err) {
    isOwner = false;
  }

  const user = await new Promise((resolve, reject) => {
    const docRef = firestore.collection("users").doc(ctx.params.username);
    try {
      docRef.get().then((doc) => {
        const { username, name, pic } = doc.data();
        resolve({
          username,
          name,
          pic,
        });
      });
    } catch (err) {
      reject(err);
    }
  });

  const posts = await new Promise((resolve, reject) => {
    try {
      firestore
        .collection("posts")
        .where("username", "==", ctx.params.username)
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

  return { props: { isOwner, posts, user: { ...user, pic: user.pic || "/svg/user-filled.svg" } } };
};

const Username = ({ isOwner, user, posts }) => {
  const [allPosts, setAllPosts] = useState(posts);

  const handleLogout = async () => {
    await firebase.auth().signOut();
    location.assign("/");
  };

  return (
    <Container>
      <img src={user.pic} className="mx-auto mt-8 mb-4 h-48 w-48 inset-white rounded-full" />
      <h3 className="font-serif font-bold text-white text-3xl text-center">{user.name}</h3>
      <h6 className="text-xl text-gray-400 text-center">@{user.username}</h6>

      <div className="flex justify-stretch p-4">
        {isOwner && (
          <>
            <Button variant="small" className="mr-1 w-full">
              Edit
            </Button>
            <Button variant="small" className="ml-1 w-full" handleClick={handleLogout}>
              Log out
            </Button>
          </>
        )}
      </div>

      {allPosts &&
        allPosts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
    </Container>
  );
};

export default Username;
