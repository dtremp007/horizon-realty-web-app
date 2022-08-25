import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SignIn from "../src/components/admin/auth/SignIn";

const SignInPage: NextPage = () => {
    const router = useRouter()

  return (
    <SignIn/>
  );
};

export default SignInPage;
