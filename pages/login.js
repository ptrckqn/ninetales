import { useState } from "react";
import { useRouter } from "next/router";
import TextField from "../components/TextInput";
import Button from "../components/Button";

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: null, password: null });

  const handleBack = () => {
    router.back();
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = form;
    alert(`LOG IN WITH ${username} ${password}`);
  };

  return (
    <div className="container flex flex-col overflow-x-hidden h-screen p-4">
      <div className="flex">
        <button className="flex-1" onClick={handleBack}>
          <img src="/svg/chevron-left.svg" className="h-8" />
        </button>
        <img src="/svg/ninetales-logo-horizontal.svg" className="h-12" />
        <div className="flex-1" />
      </div>

      <h2 className="font-bold text-4xl text-white mt-16">Welcome back, we've missed you.</h2>

      <h3 className="font-bold text-2xl text-white mt-8">Let's sign you in.</h3>

      <div className="mt-16 flex flex-col flex-1 items-center z-10">
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-between">
          <div>
            <TextField
              name="username"
              label="Username"
              value={form.username || ""}
              handleChange={handleChange}
              gutterBottom
              startIcon="/svg/user.svg"
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              value={form.password || ""}
              handleChange={handleChange}
              gutterBottom
              startIcon="/svg/lock.svg"
            />
          </div>

          <Button variant="contained" className="w-full">
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;