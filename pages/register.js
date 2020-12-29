import { useState } from "react";
import { useRouter } from "next/router";
import TextField from "../components/TextInput";
import Button from "../components/Button";
import { firebase } from "../firebase/config";

const Register = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: null, email: null, username: null, password: null });
  const [error, setError] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, username, password } = form;
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            router.push("/");
          });
      }
    }
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

      <h2 className="font-bold text-4xl text-white mt-16">Hello, it's nice to meet you.</h2>

      <h3 className="font-bold text-2xl text-white mt-8">Tell us a bit about yourself.</h3>

      <div className="mt-16 flex flex-col flex-1 items-center z-10">
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-between">
          <div>
            <TextField name="name" label="Name" value={form.name || ""} handleChange={handleChange} gutterBottom />
            <TextField name="username" label="Username" value={form.username || ""} handleChange={handleChange} gutterBottom />
            <TextField name="email" label="Email" value={form.email || ""} handleChange={handleChange} gutterBottom />

            <TextField
              type="password"
              name="password"
              label="Password"
              value={form.password || ""}
              handleChange={handleChange}
              gutterBottom
            />
            {error && <span className="mt-4 text-red-400 block">{error}</span>}
          </div>

          <div className="safe-bottom">
            <Button variant="contained" className="w-full">
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
