import { UserButton, auth } from "@clerk/nextjs";
import MainNav from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismaDB from "@/lib/prismadb";
import ThemeToggle from "./theme-toggle";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const stores = await prismaDB.store.findMany({ where: { userId } });

  return (
    <div className="border-b">
      <div className="flex items-center h-16 px-4">
        <StoreSwitcher items={stores} />
        <MainNav />
        <div className="space-x-4 ml-auto flex items-center">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
