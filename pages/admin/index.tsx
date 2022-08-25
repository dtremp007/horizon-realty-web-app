import { NextPage } from "next";
import { Button } from "@mantine/core";
import AuthUserContext from "../../src/context/authUserContext";
import { useContext } from "react";
import Show from "../../src/components/HOC/Show";
import SignIn from "../../src/components/admin/auth/SignIn";
import { useRouter } from "next/router";

const Admin: NextPage = () => {
  const {user, signOutUser} = useContext(AuthUserContext);
  const router = useRouter()

  return (
    <div className="admin__container">
    </div>
  );
};
export default Admin;
