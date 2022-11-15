import {
  SpotlightAction,
  SpotlightProvider as SProvider,
} from "@mantine/spotlight";
import {
  IconHome,
  IconDashboard,
  IconLayout2,
  IconCirclePlus,
} from "@tabler/icons";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { collection, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import { useContext } from "react";
import AuthUserContext from "../../context/authUserContext";

type SpotlightProviderProps = {
  children: React.ReactNode;
};

const SpotlightProvider = ({ children }: SpotlightProviderProps) => {
  const router = useRouter();
  const { user } = useContext(AuthUserContext);

  const adminAction: SpotlightAction[] = [
    {
      title: "Home",
      description: "Get to home page",
      onTrigger: () => router.push("/"),
      icon: <IconHome size={18} />,
    },
    {
      title: "Dashboard",
      description: "Go to admin dashboard",
      onTrigger: () => router.push("/admin/listings"),
      icon: <IconDashboard size={18} />,
    },
    {
      title: "Categories",
      description: "Go to categories page",
      onTrigger: () => router.push("/categories"),
      icon: <IconLayout2 size={18} />,
    },
    {
      title: "New Listing",
      description: "Add and edit a new listing",
      onTrigger: () => {
        const newDoc = doc(collection(db, "listings"));
        router.push(`/admin/listings/${newDoc.id}`);
      },
      icon: <IconCirclePlus size={18} />,
    },
  ];

  const userActions: SpotlightAction[] = [
    {
      title: "Home",
      description: "Get to home page",
      onTrigger: () => router.push("/"),
      icon: <IconHome size={18} />,
    },
    {
      title: "Categories",
      description: "Go to categories page",
      onTrigger: () => router.push("/categories"),
      icon: <IconLayout2 size={18} />,
    },
  ];

  return (
    <SProvider
      shortcut={["mod + K", "mod + P", "/"]}
      actions={user ? adminAction : userActions}
    >
      {children}
    </SProvider>
  );
};
export default SpotlightProvider;
