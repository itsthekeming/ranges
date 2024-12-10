declare module "simplify-geojson" {
  import type { FeatureCollection } from "geojson";
  export default function simplify(
    geojson: FeatureCollection,
    tolerance: number,
  ): FeatureCollection;
}
