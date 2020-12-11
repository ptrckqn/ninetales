import { useEffect } from "react";
import { useRouter } from "next/router";
import Container from "../components/Container";

const LOGGED_IN = true;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!LOGGED_IN) {
      router.push("/welcome");
      return;
    }
  }, []);

  return <Container></Container>;
}
