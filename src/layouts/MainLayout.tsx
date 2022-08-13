import Navbar from "../components/navigation/Navbar";
import { NavigationProvider } from "../context/navigationContext";
import { AuthUserProvider } from "../context/authUserContext";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <AuthUserProvider>
            <NavigationProvider>
                <>
                <Navbar />
                <main>{children}</main>
                </>
            </NavigationProvider>
    </AuthUserProvider>
  );
}
