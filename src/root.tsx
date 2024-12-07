import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Menu } from "~/components/menu";
import { Scene } from "~/components/scene";
import "./tailwind.css";
import { dom } from "~/components/dom";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main className="flex h-screen w-screen bg-black">
          <Scene>{children}</Scene>
          <dom.Out />
          <Menu />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
