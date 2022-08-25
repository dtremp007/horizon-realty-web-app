import { useState, useContext, useEffect } from "react";
import Spinner from "../../../shared/Spinner";
import AuthUserContext from "../../../context/authUserContext";
import Show from "../../HOC/Show";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";

const SignIn = () => {
  const { user, loading, signIn } = useContext(AuthUserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
        router.push("/admin/listings")
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn(email, password);

    setEmail("");
    setPassword("");

    router.push("/admin/listings")
  };

  return (
    <div className="sign-in__container">
      <Show when={!user} alt={<Spinner/>}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="sign-in_email">Email</label>
          <input
            id="sign-in_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="sign-in_password">Password</label>
          <input
            id="sign-in_password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Sign In</Button>
        </form>
      </Show>
    </div>
  );
};

export default SignIn;
