import { Outlet } from "react-router";
import { dom } from "~/components/dom";
import { InformationPanel } from "~/components/information-panel";
import type { Route } from "./+types/$taxon.$name";

const taxons = new Set([
  "domains",
  "kingdoms",
  "phyla",
  "classes",
  "orders",
  "familiae",
  "genera",
  "species",
])

export async function loader({ params }: Route.LoaderArgs) {
  const { taxon, name } = params;

  if (!taxons.has(taxon)) 
    throw new Response("taxon not found", { status: 404 });

  

  return {
    title: page.title,
    content: <div className="text-xl">test</div>,
  };
}

export default function Component({ loaderData}: Route.ComponentProps) {
  const { title, content } = loaderData

  return (
    <>
      <Outlet />
      <dom.In>
        <InformationPanel title={title} content={content} />
      </dom.In>
    </>
  );
}
