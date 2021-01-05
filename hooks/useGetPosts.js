import { isEmpty, isNil } from "lodash";
import { firestore } from "../firebase/config";

const PAGE_SIZE = 3;

export const useGetPosts = () => {
  const getInitialPosts = async (usernames) => {
    if (isNil(usernames) || isEmpty(usernames)) return { posts: [], last: null };

    return await new Promise((resolve, reject) => {
      try {
        firestore
          .collection("posts")
          .where("username", "in", usernames)
          .orderBy("createdAt", "desc")
          .limit(PAGE_SIZE)
          .get()
          .then((snapshot) => {
            const posts = [];
            snapshot.forEach((doc) => {
              const { createdAt, story, url, username } = doc.data();
              posts.push({ id: doc.id, createdAt, story, url, username });
            });

            resolve({ posts, last: snapshot.docs[snapshot.docs.length - 1] });
          });
      } catch (err) {
        reject(err);
      }
    });
  };

  const getMorePosts = async (usernames, lastVisible) => {
    if (isNil(usernames) || isEmpty(usernames) || isNil(lastVisible)) return [];

    return await new Promise((resolve, reject) => {
      try {
        firestore
          .collection("posts")
          .where("username", "in", usernames)
          .orderBy("createdAt", "desc")
          .startAfter(lastVisible)
          .limit(PAGE_SIZE)
          .get()
          .then((snapshot) => {
            const posts = [];
            snapshot.forEach((doc) => {
              const { createdAt, story, url, username } = doc.data();
              posts.push({ id: doc.id, createdAt, story, url, username });
            });

            resolve({ posts, last: snapshot.docs[snapshot.docs.length - 1] });
          });
      } catch (err) {
        reject(err);
      }
    });
  };

  return { getInitialPosts, getMorePosts };
};

export default useGetPosts;
