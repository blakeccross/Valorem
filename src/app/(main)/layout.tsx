import { FC, PropsWithChildren } from "react";
import FlowbiteContext from "@/context/FlowbiteContext";
import "../globals.css";
import NavbarWithDropdown from "@/components/navbar";
import UserProvider from "@/context/userContext";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import { flowbiteTheme } from "../theme";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className="flex flex-col dark:bg-gray-900">
        <UserProvider>
          <NavbarWithDropdown />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mr-auto ml-auto">
              <Flowbite theme={{ theme: flowbiteTheme }}>{children}</Flowbite>
            </div>
          </main>
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;
