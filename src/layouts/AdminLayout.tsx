import { NextPage } from "next";
import React, { useContext, useEffect } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Button,
  Tooltip,
} from "@mantine/core";
import AdminMenu from "../components/admin/AdminMenu";
import AuthUserContext from "../context/authUserContext";
import { useRouter } from "next/router";
import { logoSvg } from "../components/navigationAlt/AltNavbar";
import Link from "next/link";
import HelpModal from "../components/admin/auth/HelpModal";

type Props = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  const { user, loading, signIn, signOutUser } = useContext(AuthUserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, []);

  function handleSignOut() {
    signOutUser();
    router.push("/");
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} className="admin-layout__top-nav">
          <Link href="/">
            <Tooltip label="Go to website">
              <div className="alt-navbar__logo-wrapper">
                {logoSvg}
                <div className="alt-navbar__logo-text">
                  <p className="horizon">HORIZON</p>
                  <p className="rlst">Real&nbsp;Estate</p>
                </div>
              </div>
            </Tooltip>
          </Link>
          <Button style={{}} onClick={handleSignOut}>
            Sign Out
          </Button>
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
      <>
        {children}
        <HelpModal />
      </>
    </AppShell>
  );
};

export default AdminLayout;
