import React from "react";
import {
  IconHome,
  IconFilter,
  IconSettings,
  IconNotebook,
} from "@tabler/icons";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import Link from "next/link";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  href: string;
}

function AdminLink({ icon, color, label, href }: MainLinkProps) {
  return (
    <Link href={href}>
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
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
  { icon: <IconFilter size={16} />, color: "yellow", label: "Filters", href: "/admin/filters" },
  { icon: <IconSettings size={16} />, color: "green", label: "Settings", href: "/admin/settings" },
  { icon: <IconNotebook size={16} />, color: "blue", label: "Pages", href: "/admin/pages" },
];

const AdminMenu = () => {
  const links = data.map((link) => <AdminLink {...link} key={link.label} />);
  return <div>{links}</div>;
};
export default AdminMenu;
