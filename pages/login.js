import { useState } from "react";
import TextField from "../components/TextInput";
import Button from "../components/Button";

const Login = () => {
  const [form, setForm] = useState({ username: null, password: null });

  const handleChange = (e) => {
    const { value, name } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = form;
    console.log("LOGIN WITH", username, password);
  };

  return (
    <div className="container relative overflow-x-hidden overflow-y-visible h-screen">
      <div className="absolute-center z-20 w-full">
        <img src="/svg/ninetales-logo-vertical.svg" className="w-10/12 mx-auto" />
        <div className="mt-20 px-8 flex flex-col items-center z-10">
          <form onSubmit={handleSubmit}>
            <TextField name="username" placeholder="Username" value={form.username || ""} handleChange={handleChange} gutterBottom />
            <TextField
              type="password"
              name="password"
              placeholder="Password"
              value={form.password || ""}
              handleChange={handleChange}
              gutterBottom
            />
            <div className="px-8">
              <Button variant="contained" className="w-full mb-4">
                Login
              </Button>

              <Button variant="outlined" className="w-full">
                Sign Up
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="z-0 absolute-center w-full">
        <img src="/svg/ninetales-logo.svg" className="login-bg" />
      </div>
    </div>
  );
};

export default Login;
