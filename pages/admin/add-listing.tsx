import { NextPage } from "next";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SignIn from "../../src/components/admin/auth/SignIn";
import { Button } from "@mantine/core";
import AuthUserContext from "../../src/context/authUserContext";
import { useContext, useEffect } from "react";
import Show from "../../src/components/HOC/Show";
import AddListing from "../../src/components/admin/listings/AddListing";
import { useRouter } from "next/router";

const AddListingPage: NextPage = () => {
  const {user, signOutUser} = useContext(AuthUserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user)
      router.push('/admin')
  }, [user])

  if (user) {
    return (
        <AddListing />
    )
  }

  return null;
};
export default AddListingPage;
