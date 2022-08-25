import { NextPage } from "next";
import React, { useContext, useEffect } from "react";
import EditListing from "../components/admin/listings/EditListing";
import { AppShell, Navbar, Header, Aside, Footer, Button } from "@mantine/core";
import AdminMenu from "../components/admin/AdminMenu";
import AuthUserContext from "../context/authUserContext";
import { useRouter } from "next/router";

type Props = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  const { user, loading, signIn, signOutUser } = useContext(AuthUserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
        router.push("/signin")
    }
  }, [])

  function handleSignOut() {
    signOutUser();
    router.push("/")
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} className="admin-layout__top-nav">
          <Button style={{}} onClick={handleSignOut}>Sign Out</Button>
        </Header>
      }
      navbar={
        <Navbar width={{ base: 300 }} className="admin-layout__left-nav" p="xs">
          <Navbar.Section grow>
            <AdminMenu />
          </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {/* <div className="admin-layout__main">{children}</div> */}
      {children}
    </AppShell>
  );
};

export default AdminLayout;
