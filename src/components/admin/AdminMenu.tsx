import React from "react";
import {
  IconHome,
  IconFilter,
  IconSettings,
  IconNotebook,
  IconPictureInPicture
} from "@tabler/icons";
import { ThemeIcon, UnstyledButton,Flex, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  href: string;
}

function AdminLink({ icon, color, label, href }: MainLinkProps) {
    const router = useRouter();

  return (
    <Link href={href}>
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colors.dark[0],
          backgroundColor: router.pathname === href ? theme.colors.dark[8] : "",

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Flex>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Flex>
      </UnstyledButton>
    </Link>
  );
}

const data = [
  {
    icon: <IconHome size={16} />,
    color: "red",
    label: "Listings",
    href: "/admin/listings",
  },
  {
    icon: <IconFilter size={16} />,
    color: "yellow",
    label: "Filters",
    href: "/admin/filters",
  },
  {
    icon: <IconSettings size={16} />,
    color: "green",
    label: "Settings",
    href: "/admin/settings",
  },
  {
    icon: <IconNotebook size={16} />,
    color: "blue",
    label: "Pages",
    href: "/admin/pages",
  },
  {
    icon: <IconPictureInPicture size={16} />,
    color: "red",
    label: "Images",
    href: "/admin/images",
  },
];

const AdminMenu = () => {
  const links = data.map((link) => <AdminLink {...link} key={link.label} />);
  return <div>{links}</div>;
};
export default AdminMenu;
