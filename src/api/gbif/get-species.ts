import { nameUsageSchema } from "~/types/name-usage";

export async function getSpecies(key: string) {
    const url = `https://api.gbif.org/v1/species/${key}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "accept": "application/json",
            "Accept-Language": "en",
        },
    });

    const data = await response.json();
    const nameUsage = await nameUsageSchema.parseAsync(data);

    return nameUsage;
}