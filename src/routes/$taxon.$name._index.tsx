import fs from "fs";
import { Distribution } from "~/components/distribution.client";
import simplify from "simplify-geojson";
import type { Route } from "./+types/$taxon.$name._index";

const levelOfDetail = 0.01;

export async function loader({ params }: Route.LoaderArgs) {
  const { name } = params;

  const distribution = simplify(
    JSON.parse(
      fs.readFileSync(
        `_data/species/${name}/distributions/default.json`,
        "utf-8"
      )
    ),
    levelOfDetail
  );

  return {
    distribution,
  };
}

export default function ({ loaderData }: Route.ComponentProps) {
  const { distribution } = loaderData;

  return <Distribution distribution={distribution} />;
}
