import { nameUsageSchema } from "~/types/name-usage";
import fs from 'node:fs/promises'
import { speciesMetaSchema } from "~/types/species-meta";

export async function getSpecies(name: string) {
    const speciesMeta = await speciesMetaSchema.parseAsync(JSON.parse(await fs.readFile(`_data/species/${name}/meta.json`, "utf-8")));

    const url = `https://api.gbif.org/v1/species/${speciesMeta.gbifKey}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "accept": "application/json",
            "Accept-Language": "en",
        },
    });

    const { success, data, error } = await nameUsageSchema.safeParseAsync(await response.json());

    if (!success) {
        console.error(error.errors[0].path)
        throw error
    }

    return data;
}