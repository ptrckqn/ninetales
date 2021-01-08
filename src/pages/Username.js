import { useState, useEffect, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { get, isNil } from 'lodash';
import { toast } from 'react-toastify';
import fb from 'firebase';
import { firebase, firestore } from '../firebase';
import { uploadPhoto } from '../firebase/functions';
import { useGetPosts } from '../hooks/useGetPosts';
import { useAuth } from '../context/authContext';
import Posts from '../components/Posts';
import Button from '../components/Button';

const types = ['image/png', 'image/jpeg'];

const Username = ({ match }) => {
  const history = useHistory();
  const auth = useAuth();
  const { getInitialPosts } = useGetPosts();
  const [user, setUser] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [editPic, setEditPic] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  const isOwner = useMemo(() => {
    if (!auth) return false;
    return auth.username === match.params.username;
  }, [auth, match]);

  const handleLogout = async () => {
    await firebase.auth().signOut();
    history.push('/');
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
    const { url, filename } = await uploadPhoto(file, 'profile-pics');

    const docRef = firestore.collection('users').doc(auth.username);

    await docRef.update({
      pic: url,
      picName: filename,
    });

    toast.success('Profile picture updated');
    setFile(null);
    setEditPic(false);
    setLoading(false);
  };

  const handleShowRequests = (open) => () => {
    setShowRequests(open);
    document.body.style.overflow = open ? 'hidden' : 'unset';
  };

  const handleRequest = (id, accept) => async () => {
    const requestRef = firestore.collection('pendingRequests').doc(id);
    const doc = await requestRef.get();
    const { source } = doc.data();

    if (accept) {
      const sourceRef = firestore.collection('users').doc(source);
      await sourceRef.update({
        friends: fb.firestore.FieldValue.arrayUnion(auth.username),
      });

      const targetRef = firestore.collection('users').doc(auth.username);
      await targetRef.update({
        friends: fb.firestore.FieldValue.arrayUnion(source),
      });

      toast.success(`Accepted request from ${source}`);
    } else {
      toast.warning(`Removed request from ${source}`);
    }

    await requestRef.delete();

    // Refetch Requests
    getRequests();
  };

  const getRequests = async () => {
    const pending = [];
    const pendingRequestsRef = await firestore.collection('pendingRequests').where('target', '==', auth.username).get();

    for (let pendingRequest of pendingRequestsRef.docs) {
      const { source } = pendingRequest.data();
      const sourceRef = await firestore.collection('users').doc(source).get();
      const { username, name, pic } = sourceRef.data();
      pending.push({ id: pendingRequest.id, username, name, pic: pic || '/svg/user-filled.svg' });
    }

    setRequests(pending);
  };

  useEffect(() => {
    (async () => {
      // Get user
      const docRef = firestore.collection('users').doc(match.params.username.toLowerCase());
      const doc = await docRef.get();
      if (doc.exists) {
        const { name, pic, username } = doc.data();
        setUser({ name, pic, username, found: true });
      } else {
        setUser({ found: false });
      }

      // Get posts
      const { posts } = await getInitialPosts([match.params.username]);
      setAllPosts(posts);
    })();
  }, [match]);

  useEffect(() => {
    if (get(auth, 'username') === match.params.username) {
      getRequests();
    }
  }, [auth, match]);

  if (isNil(user)) return null;

  if (!user.found) return <div>USER NOT FOUND</div>;

  return (
    <>
      <div className="flex justify-center">
        <div className="relative mt-8 mb-4">
          <img src={preview || user.pic || '/svg/user-filled.svg'} className=" h-48 w-48 inset-white rounded-full object-cover" />

          {isOwner && (
            <>
              {editPic ? (
                <button className="absolute right-0 bottom-0 bg-green-400 rounded-full p-2" onClick={handleSubmit} disabled={loading}>
                  {loading ? <img src="/svg/loader.svg" className="animate-spin inline h-6 w-6" /> : <img src="/svg/check.svg" className="h-6 w-6" />}
                </button>
              ) : (
                <label className="cursor-pointer absolute right-0 bottom-0 bg-gray-600 rounded-full p-2">
                  <img src="/svg/pencil.svg" className="h-6 w-6" />
                  <input type="file" onChange={handleFile} accept="image/png, image/jpeg" className="hidden" />
                </label>
              )}

              {editPic && (
                <button className="absolute left-0 bottom-0 bg-red-400 rounded-full p-2" onClick={handleCancel}>
                  <img src="/svg/cancel.svg" className="h-6 w-6" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <h3 className="font-serif font-bold text-white text-2xl text-center">{user.name}</h3>
      <h6 className="text-lg text-gray-400 text-center">@{user.username}</h6>

      <div className="p-4">
        {isOwner && (
          <>
            {requests.length > 0 && (
              <Button variant="contained" small className="mb-2 w-full" handleClick={handleShowRequests(true)}>
                {requests.length} Request{requests.length === 1 ? '' : 's'}
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

      <Posts posts={allPosts} />

      <div className={`fixed h-screen w-screen left-0 top-0 bg-black bg-opacity-75 grid place-items-center ${showRequests ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={handleShowRequests(false)}>
        <div className="bg-gray-600 w-11/12 max-h-96 overflow-y-auto rounded p-4">
          <h3 className="font-bold text-2xl text-white">
            {requests.length} Request{requests.length === 1 ? '' : 's'}
          </h3>
          {requests.map(({ id, username, name, pic }) => {
            return (
              <div key={id} className="flex justify-between items-center mt-4">
                <img src={pic} className="h-12 w-12 rounded-full mr-2" />
                <div className="leading-5">
                  <Link to={`/${username}`}>
                    <h6 className="font-bold text-white">{name}</h6>
                    <span className="text-gray-400 italic">@{username}</span>
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
