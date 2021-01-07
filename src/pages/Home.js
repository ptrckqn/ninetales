import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { firebase } from '../firebase';
import { useAuth } from '../context/authContext';
import { useGetPosts } from '../hooks/useGetPosts';
import Container from '../components/Container';
import Loading from '../components/Loading';
import Splash from '../components/Splash';
import Posts from '../components/Posts';

const Home = () => {
  const auth = useAuth();
  const history = useHistory();
  const { getInitialPosts, getMorePosts } = useGetPosts();
  const [splash, setSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [lastPost, setLastPost] = useState();

  const fetchPosts = async (refresh) => {
    if (auth) {
      const usernames = [auth.username, ...auth.friends];
      let newLastPost;
      if (refresh) {
        const { posts, last } = await getInitialPosts(usernames);
        setAllPosts(posts);
        newLastPost = last;
      } else if (!isEmpty(allPosts)) {
        const { posts, last } = await getMorePosts(usernames, lastPost);
        if (!isEmpty(posts)) {
          setAllPosts([...allPosts, ...posts]);
          newLastPost = last;
        }
      }

      setLastPost(newLastPost);
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        history.push('/welcome');
      } else {
        setSplash(false);
      }
    });

    fetchPosts(true);
  }, []);

  useEffect(() => {
    if (isEmpty(allPosts)) {
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
      <Posts posts={allPosts} />
    </Container>
  );
};

export default Home;
