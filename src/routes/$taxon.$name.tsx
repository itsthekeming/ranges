import { Link, Outlet } from "react-router";
import { dom } from "~/components/dom";
import { InformationPanel } from "~/components/information-panel";
import type { Route } from "./+types/$taxon.$name";
import { getSpecies } from "~/api/gbif/get-species";
import { useStore } from "~/state";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const taxons = new Set([
  "domains",
  "kingdoms",
  "phyla",
  "classes",
  "orders",
  "familiae",
  "genera",
  "species",
]);

export async function loader({ params }: Route.LoaderArgs) {
  const { taxon, name } = params;

  if (!taxons.has(taxon))
    throw new Response("taxon not found", { status: 404 });

  const gbifData = await getSpecies(name);

  const {
    kingdom,
    phylum,
    class: _class,
    order,
    family,
    genus,
    canonicalName,
  } = gbifData;

  return {
    ...gbifData,
    breadCrumbs: [
      { name: kingdom, href: `/kingdoms/${kingdom}` },
      { name: phylum, href: `/phyla/${phylum}` },
      { name: _class, href: `/classes/${_class}` },
      { name: order, href: `/orders/${order}` },
      { name: family, href: `/familiae/${family}` },
      { name: genus, href: `/genera/${genus}` },
      { name: canonicalName, href: `/species/${name}` },
    ],
    content: <div className="text-xl">test</div>,
  };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const scienceMode = useStore((state) => state.scienceMode);

  let title: string;

  if (scienceMode)
    title = loaderData.canonicalName ?? loaderData.scientificName;
  else title = loaderData.vernacularName ?? loaderData.scientificName;

  return (
    <>
      <Outlet />
      <dom.In>
        <InformationPanel
          title={title}
          content={<Breadcrumbs breadcrumbs={loaderData.breadCrumbs} />}
        />
      </dom.In>
    </>
  );
}

interface BreadcrumbsProps {
  breadcrumbs: { name: string | undefined; href: string }[];
}

function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <ul className="flex space-x-1 text-xs items-end">
      {breadcrumbs.map((breadcrumb, index) => (
        <li key={index} className="flex items-center space-x-1">
          <Link to={breadcrumb.href} className="leading-3">
            {breadcrumb.name}
          </Link>
          {index < breadcrumbs.length - 1 && (
            <ChevronRightIcon className="size-3" />
          )}
        </li>
      ))}
    </ul>
  );
}
