import nookies from "nookies";
import { admin } from "../firebase/admin";
import { firebase } from "../firebase/config";
import Container from "../components/Container";
import Post from "../components/Post";

export const getServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { name } = token;

    return { props: { isOwner: name === ctx.params.username, posts: [] } };
  } catch (err) {
    ctx.res.writeHead(302, { Location: "/welcome" });
    ctx.res.end();

    return { props: { isOwner: false, posts: [] } };
  }
};

const Username = ({ isOwner }) => {
  const handleLogout = async () => {
    await firebase.auth().signOut();
    location.reload();
  };

  return <Container>{isOwner && <button onClick={handleLogout}>Log out</button>}</Container>;
};

export default Username;
