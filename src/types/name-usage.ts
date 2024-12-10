import { z } from "zod";

const nameTypeEnum = z.enum([
  "SCIENTIFIC",
  "VIRUS",
  "HYBRID",
  "INFORMAL",
  "CULTIVAR",
  "CANDIDATUS",
  "OTU",
  "DOUBTFUL",
  "PLACEHOLDER",
  "NO_NAME",
  "BLACKLISTED",
]);

const rankEnum = z.enum([
  "DOMAIN",
  "SUPERKINGDOM",
  "KINGDOM",
  "SUBKINGDOM",
  "INFRAKINGDOM",
  "SUPERPHYLUM",
  "PHYLUM",
  "SUBPHYLUM",
  "INFRAPHYLUM",
  "SUPERCLASS",
  "CLASS",
  "SUBCLASS",
  "INFRACLASS",
  "PARVCLASS",
  "SUPERLEGION",
  "LEGION",
  "SUBLEGION",
  "INFRALEGION",
  "SUPERCOHORT",
  "COHORT",
  "SUBCOHORT",
  "INFRACOHORT",
  "MAGNORDER",
  "SUPERORDER",
  "GRANDORDER",
  "ORDER",
  "SUBORDER",
  "INFRAORDER",
  "PARVORDER",
  "SUPERFAMILY",
  "FAMILY",
  "SUBFAMILY",
  "INFRAFAMILY",
  "SUPERTRIBE",
  "TRIBE",
  "SUBTRIBE",
  "INFRATRIBE",
  "SUPRAGENERIC_NAME",
  "GENUS",
  "SUBGENUS",
  "INFRAGENUS",
  "SECTION",
  "SUBSECTION",
  "SERIES",
  "SUBSERIES",
  "INFRAGENERIC_NAME",
  "SPECIES_AGGREGATE",
  "SPECIES",
  "INFRASPECIFIC_NAME",
  "GREX",
  "SUBSPECIES",
  "CULTIVAR_GROUP",
  "CONVARIETY",
  "INFRASUBSPECIFIC_NAME",
  "PROLES",
  "RACE",
  "NATIO",
  "ABERRATION",
  "MORPH",
  "VARIETY",
  "SUBVARIETY",
  "FORM",
  "SUBFORM",
  "PATHOVAR",
  "BIOVAR",
  "CHEMOVAR",
  "MORPHOVAR",
  "PHAGOVAR",
  "SEROVAR",
  "CHEMOFORM",
  "FORMA_SPECIALIS",
  "CULTIVAR",
  "STRAIN",
  "OTHER",
  "UNRANKED",
]);

const originEnum = z.enum([
  "SOURCE",
  "DENORMED_CLASSIFICATION",
  "VERBATIM_PARENT",
  "VERBATIM_ACCEPTED",
  "VERBATIM_BASIONYM",
  "PROPARTE",
  "AUTONYM",
  "IMPLICIT_NAME",
  "MISSING_ACCEPTED",
  "BASIONYM_PLACEHOLDER",
  "EX_AUTHOR_SYNONYM",
  "OTHER",
]);

const taxonomicStatusEnum = z.enum([
  "ACCEPTED",
  "DOUBTFUL",
  "SYNONYM",
  "HETEROTYPIC_SYNONYM",
  "HOMOTYPIC_SYNONYM",
  "PROPARTE_SYNONYM",
  "MISAPPLIED",
]);

const nomenclaturalStatusEnum = z.enum([
  "LEGITIMATE",
  "VALIDLY_PUBLISHED",
  "NEW_COMBINATION",
  "REPLACEMENT",
  "CONSERVED",
  "PROTECTED",
  "CORRECTED",
  "ORIGINAL_COMBINATION",
  "NEW_SPECIES",
  "NEW_GENUS",
  "ALTERNATIVE",
  "OBSCURE",
  "CONSERVED_PROPOSED",
  "PROVISIONAL",
  "SUBNUDUM",
  "REJECTED_PROPOSED",
  "REJECTED_OUTRIGHT_PROPOSED",
  "DOUBTFUL",
  "AMBIGUOUS",
  "CONFUSED",
  "FORGOTTEN",
  "ABORTED",
  "ORTHOGRAPHIC_VARIANT",
  "SUPERFLUOUS",
  "NUDUM",
  "NULL_NAME",
  "SUPPRESSED",
  "REJECTED_OUTRIGHT",
  "REJECTED",
  "ILLEGITIMATE",
  "INVALID",
  "DENIED",
]);

const issuesEnum = z.enum([
  "PARENT_NAME_USAGE_ID_INVALID",
  "ACCEPTED_NAME_USAGE_ID_INVALID",
  "ORIGINAL_NAME_USAGE_ID_INVALID",
  "ACCEPTED_NAME_MISSING",
  "RANK_INVALID",
  "NOMENCLATURAL_STATUS_INVALID",
  "TAXONOMIC_STATUS_INVALID",
  "SCIENTIFIC_NAME_ASSEMBLED",
  "CHAINED_SYNOYM",
  "BASIONYM_AUTHOR_MISMATCH",
  "TAXONOMIC_STATUS_MISMATCH",
  "PARENT_CYCLE",
  "CLASSIFICATION_RANK_ORDER_INVALID",
  "CLASSIFICATION_NOT_APPLIED",
  "VERNACULAR_NAME_INVALID",
  "DESCRIPTION_INVALID",
  "DISTRIBUTION_INVALID",
  "SPECIES_PROFILE_INVALID",
  "MULTIMEDIA_INVALID",
  "BIB_REFERENCE_INVALID",
  "ALT_IDENTIFIER_INVALID",
  "BACKBONE_MATCH_NONE",
  "BACKBONE_MATCH_FUZZY",
  "BACKBONE_MATCH_AGGREGATE",
  "ACCEPTED_NAME_NOT_UNIQUE",
  "PARENT_NAME_NOT_UNIQUE",
  "ORIGINAL_NAME_NOT_UNIQUE",
  "RELATIONSHIP_MISSING",
  "ORIGINAL_NAME_DERIVED",
  "CONFLICTING_BASIONYM_COMBINATION",
  "NO_SPECIES",
  "NAME_PARENT_MISMATCH",
  "ORTHOGRAPHIC_VARIANT",
  "HOMONYM",
  "PUBLISHED_BEFORE_GENUS",
  "UNPARSABLE",
  "PARTIALLY_PARSABLE",
]);

export const nameUsageSchema = z.object({
  key: z.number().int().describe("The name usage key that uniquely identifies this name usage."),
  nubKey: z.number().int().optional(),
  nameKey: z.number().int().optional(),
  taxonID: z.string().optional(),
  sourceTaxonKey: z.number().int().optional(),
  kingdom: z.string().optional(),
  phylum: z.string().optional(),
  order: z.string().optional(),
  family: z.string().optional(),
  genus: z.string().optional(),
  subgenus: z.string().optional(),
  species: z.string().optional(),
  kingdomKey: z.number().int().optional(),
  phylumKey: z.number().int().optional(),
  classKey: z.number().int().optional(),
  orderKey: z.number().int().optional(),
  familyKey: z.number().int().optional(),
  genusKey: z.number().int().optional(),
  subgenusKey: z.number().int().optional(),
  speciesKey: z.number().int().optional(),
  datasetKey: z.string().uuid().describe("The checklist that “hosts” this name usage."),
  constituentKey: z.string().uuid().optional(),
  parentKey: z.number().int().optional(),
  parent: z.string().optional(),
  proParteKey: z.number().int().optional(),
  acceptedKey: z.number().int().optional(),
  accepted: z.string().optional(),
  basionymKey: z.number().int().optional(),
  basionym: z.string().optional(),
  scientificName: z.string().describe("The scientific name, possibly with date/authorship."),
  canonicalName: z.string().optional(),
  vernacularName: z.string().optional(),
  authorship: z.string().optional(),
  nameType: nameTypeEnum.optional(),
  rank: rankEnum.optional(),
  origin: originEnum.describe("The name usage origin."),
  taxonomicStatus: taxonomicStatusEnum.optional(),
  nomenclaturalStatus: z.array(nomenclaturalStatusEnum).optional(),
  remarks: z.string().optional(),
  publishedIn: z.string().optional(),
  accordingTo: z.string().optional(),
  numDescendants: z.number().int().optional(),
  references: z.string().url().optional(),
  modified: z.string().datetime().optional(),
  deleted: z.string().datetime().optional(),
  lastCrawled: z.string().datetime({ offset: true }).optional(),
  lastInterpreted: z.string().datetime({ offset: true }).optional(),
  issues: z.array(issuesEnum).describe("Data quality issues found.").optional(),
  class: z.string().optional(),
}).strict().required({
  datasetKey: true,
  issues: true,
  key: true,
  origin: true,
  scientificName: true
});

export type NameUsage = z.infer<typeof nameUsageSchema>;