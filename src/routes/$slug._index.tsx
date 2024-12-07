import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import fs from "fs";
import type { FeatureCollection } from "geojson";
import invariant from "tiny-invariant";
import { Distribution } from "~/components/distribution.client";

interface LoaderData {
  distribution: FeatureCollection;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  invariant(slug);

  const distribution = JSON.parse(
    fs.readFileSync(`_data/${slug}/distributions/default.json`, "utf-8")
  ) as FeatureCollection;

  const data: LoaderData = {
    distribution,
  };

  return data;
}

export default function Component() {
  const { distribution } = useLoaderData<LoaderData>();

  return <Distribution distribution={distribution} />;
}
