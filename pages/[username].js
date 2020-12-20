import { useState } from "react";
import nookies from "nookies";
import { admin, firestore } from "../firebase/admin";
import { uploadPhoto } from "../firebase/functions";
import { firebase } from "../firebase/config";
import Container from "../components/Container";
import Post from "../components/Post";
import Button from "../components/Button";

const types = ["image/png", "image/jpeg"];

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

  let user;
  try {
    user = await new Promise((resolve, reject) => {
      const docRef = firestore.collection("users").doc(ctx.params.username);
      try {
        docRef.get().then((doc) => {
          if (!doc.exists) {
            reject();
          }
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
  } catch (err) {
    return {
      notFound: true,
    };
  }

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
  const [editPic, setEditPic] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await firebase.auth().signOut();
    location.assign("/");
  };

  const handleFile = (e) => {
    const selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setPreview(URL.createObjectURL(selected));
      setFile(selected);
      setEditPic(true);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setFile(null);
    setEditPic(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { url, filename } = await uploadPhoto(file, "profile-pics");

    const res = await fetch("/api/updatePic", {
      method: "POST",
      body: JSON.stringify({ url, filename }),
    });

    if (res.ok) {
      setFile(null);
      setEditPic(false);
    }

    setLoading(false);
  };

  return (
    <Container>
      <div className="flex justify-center">
        <div className=" relative mt-8 mb-4">
          <img src={preview || user.pic} className=" h-48 w-48 inset-white rounded-full object-cover" />

          {isOwner && (
            <>
              {editPic ? (
                <button className="absolute right-0 bottom-0 bg-gray-600 rounded-full p-2" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <img src="/svg/loader.svg" className="animate-spin inline h-6 w-6" />
                  ) : (
                    <img src="/svg/check.svg" className="h-6 w-6" />
                  )}
                </button>
              ) : (
                <label className="cursor-pointer absolute right-0 bottom-0 bg-gray-600 rounded-full p-2">
                  <img src="/svg/pencil.svg" className="h-6 w-6" />
                  <input type="file" onChange={handleFile} accept="image/png, image/jpeg" className="hidden" />
                </label>
              )}

              {editPic && (
                <button className="absolute left-0 bottom-0 bg-gray-600 rounded-full p-2" onClick={handleCancel}>
                  <img src="/svg/cancel.svg" className="h-6 w-6" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <h3 className="font-serif font-bold text-white text-3xl text-center">{user.name}</h3>
      <h6 className="text-xl text-gray-400 text-center">@{user.username}</h6>

      <div className="flex justify-stretch p-4">
        {isOwner && (
          <>
            {/* <Button variant="small" className="mr-1 w-full">
              Edit
            </Button> */}
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
