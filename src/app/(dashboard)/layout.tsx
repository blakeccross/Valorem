import SidebarNav from "@/components/sidebar";

import { FC, PropsWithChildren } from "react";
import FlowbiteContext from "@/context/FlowbiteContext";
import "@/app/globals.css";
import NavbarWithDropdown from "@/components/navbar";
import UserProvider from "@/context/userContext";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import { flowbiteTheme } from "@/app/theme";
import SidebarProvider from "@/context/sidebarContext";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className="flex flex-col dark:bg-gray-900">
        <UserProvider>
          <div className="fixed top-0 w-full z-10">
            <NavbarWithDropdown />
          </div>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-[67px]">
            <div className="flex">
              <Flowbite theme={{ theme: flowbiteTheme }}>
                <SidebarProvider>
                  <SidebarNav />
                  <div className="ml-[64px] md:ml-64 w-full">{children}</div>
                </SidebarProvider>
              </Flowbite>
            </div>
          </main>
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;
