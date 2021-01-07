import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Welcome = () => {
  return (
    <div className="container relative overflow-x-hidden overflow-y-visible h-screen">
      <div className="absolute-center z-20 w-full h-full flex flex-col justify-between items-center p-4">
        <div />
        <img src="/svg/ninetales-logo-vertical.svg" className="w-10/12 mx-auto" />

        <div className="w-full safe-bottom">
          <Link to="/login">
            <Button variant="muted" className="mb-1 w-full">
              Log in
            </Button>
          </Link>

          <Link to="/register">
            <Button variant="contained" className="mt-1 w-full">
              Register
            </Button>
          </Link>
        </div>
      </div>

      <div className="z-0 absolute-center w-full">
        <img src="/svg/ninetales-logo.svg" className="login-bg" />
      </div>
    </div>
  );
};

export default Welcome;
