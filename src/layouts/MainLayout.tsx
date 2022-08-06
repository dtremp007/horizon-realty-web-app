import Navbar from "../components/navigation/Navbar";
import { NavigationProvider } from "../context/navigationContext";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <>
      <NavigationProvider>
        <>
          <Navbar />
          <main>{children}</main>
        </>
      </NavigationProvider>
    </>
  );
}
