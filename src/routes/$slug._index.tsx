import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import fs from "fs";
import type { FeatureCollection } from "geojson";
import invariant from "tiny-invariant";
import { Distribution } from "~/components/distribution.client";
import simplify from 'simplify-geojson'

const levelOfDetail = 0.01;

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  invariant(slug);

  const distribution = simplify(JSON.parse(
    fs.readFileSync(`_data/${slug}/distributions/default.json`, "utf-8")
  ), levelOfDetail) as FeatureCollection;

  const data = {
    distribution,
  };

  return data;
}

export default function Component() {
  const { distribution } = useLoaderData<typeof loader>();

  return <Distribution distribution={distribution} />;
}
