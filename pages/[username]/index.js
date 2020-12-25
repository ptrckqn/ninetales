import { useState } from "react";
import nookies from "nookies";
import Link from "next/link";
import { admin, firestore } from "../../firebase/admin";
import { uploadPhoto } from "../../firebase/functions";
import { firebase } from "../../firebase/config";
import useRouterRefresh from "../../hooks/useRouterRefresh";
import Container from "../../components/Container";
import Post from "../../components/Post";
import Button from "../../components/Button";

const types = ["image/png", "image/jpeg"];

export const getServerSideProps = async (ctx) => {
  let isOwner, user, requests;
  try {
    const cookies = nookies.get(ctx);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { name } = token;

    isOwner = name === ctx.params.username;
  } catch (err) {
    isOwner = false;
  }

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

  if (isOwner && user) {
    requests = await new Promise((resolve, reject) => {
      firestore
        .collection("pendingRequests")
        .where("target", "==", ctx.params.username)
        .get()
        .then((snapshot) => {
          const pending = [];
          try {
            snapshot.forEach((doc) => {
              const id = doc.id;
              const { source } = doc.data();
              const sourceRef = firestore.collection("users").doc(source);
              sourceRef.get().then((doc) => {
                const { username, name, pic } = doc.data();
                pending.push({ id, username, name, pic: pic || "/svg/user-filled.svg" });
              });
            });

            resolve(pending);
          } catch (err) {
            reject(err);
          }
        });
    });
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

  return { props: { isOwner, posts, user: { ...user, pic: user.pic || "/svg/user-filled.svg" }, requests } };
};

const Username = ({ isOwner, user, posts, requests }) => {
  const refresh = useRouterRefresh();
  const [allPosts, setAllPosts] = useState(posts);
  const [editPic, setEditPic] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

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

  const handleShowRequests = (open) => () => {
    setShowRequests(open);
    document.body.style.overflow = open ? "hidden" : "unset";
  };

  const handleRequest = (id, accept) => async () => {
    const res = await fetch("/api/confirmFriend", {
      method: "POST",
      body: JSON.stringify({ id, accept }),
    });

    if (res.ok) {
      refresh();
    }
  };

  return (
    <>
      <Container>
        <div className="flex justify-center">
          <div className="relative mt-8 mb-4">
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

        <div className="p-4">
          {isOwner && (
            <>
              {requests.length > 0 && (
                <Button variant="contained" small className="mb-2 w-full" handleClick={handleShowRequests(true)}>
                  {requests.length} Request{requests.length === 1 ? "" : "s"}
                </Button>
              )}
              <div className="flex justify-stretch ">
                {/* <Button variant="muted" small className="mr-1 w-full">
              Edit
            </Button> */}
                <Button variant="muted" small className="w-full" handleClick={handleLogout}>
                  Log out
                </Button>
              </div>
            </>
          )}
        </div>

        {allPosts &&
          allPosts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
      </Container>

      <div
        className={`fixed h-screen w-screen left-0 top-0 bg-black bg-opacity-75 grid place-items-center ${
          showRequests ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleShowRequests(false)}
      >
        <div className="bg-gray-600 w-11/12 max-h-96 overflow-y-auto rounded p-4">
          <h3 className="font-bold text-2xl text-white">
            {requests.length} Request{requests.length === 1 ? "" : "s"}
          </h3>
          {requests.map(({ id, username, name, pic }) => {
            return (
              <div key={id} className="flex justify-between items-center mt-4">
                <img src={pic} className="h-12 w-12 rounded-full mr-2" />
                <div className="leading-5">
                  <Link href={`/${username}`}>
                    <a>
                      <h6 className="font-bold text-white">{name}</h6>
                      <span className="text-gray-400 italic">@{username}</span>
                    </a>
                  </Link>
                </div>
                <div className="flex-grow flex justify-end">
                  <button onClick={handleRequest(id, false)}>
                    <img src="/svg/cancel.svg" className="h-10 w-10 p-1 rounded-full bg-red-400 mr-4" />
                  </button>
                  <button onClick={handleRequest(id, true)}>
                    <img src="/svg/check.svg" className="h-10 w-10 p-1 rounded-full bg-green-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Username;
