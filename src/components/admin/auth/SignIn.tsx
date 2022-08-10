import { useState, useContext } from "react";
import Spinner from "../../../shared/Spinner";
import AuthUserContext from "../../../context/authUserContext";
import Show from "../../HOC/Show";
import { Button } from "@mantine/core";

const SignIn = () => {
  const { user, loading, signIn } = useContext(AuthUserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(email, password);

    setEmail("");
    setPassword("");
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
            type="text"
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
