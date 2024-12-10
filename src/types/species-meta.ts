import { z } from "zod";

export const speciesMetaSchema = z.object({
    gbifKey: z.string(),
    image: z.string(),
}).strict().required({
    gbifKey: true,
    image: true
});

export type SpeciesMeta = z.infer<typeof speciesMetaSchema>;