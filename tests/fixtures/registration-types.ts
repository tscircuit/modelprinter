import { z } from "zod"
import {
  defineModel,
  ModelRegistry,
  type FlexScreenModelDefinition,
  type ModelDefinition,
  type RawModelprinterParams,
} from "../../src"

/** Compile-only assertions: this function is never invoked. */
export function assertRegistrationTypes(): void {
  const alphaSchema = z.object({
    fn: z.literal("reviewalpha"),
    width: z.number(),
  })
  const betaSchema = z.object({
    fn: z.literal("reviewbeta"),
    width: z.number(),
  })
  const broadFnSchema = z.object({ fn: z.string(), width: z.number() })
  const unionFnSchema = z.object({
    fn: z.union([z.literal("reviewalpha"), z.literal("reviewbeta")]),
    width: z.number(),
  })
  const parseAlpha = (_params: RawModelprinterParams) => ({
    fn: "reviewalpha" as const,
    width: 1,
  })
  const parseBeta = (_params: RawModelprinterParams) => ({
    fn: "reviewbeta" as const,
    width: 1,
  })
  const alpha = defineModel({
    name: "reviewalpha",
    schema: alphaSchema,
    parse: parseAlpha,
  })
  const name: "reviewalpha" = alpha.name
  const parsed = alpha.parse({ fn: "reviewalpha", string: "reviewalpha" })
  const discriminator: "reviewalpha" = parsed.fn
  const width: number = parsed.width
  void [name, discriminator, width]

  // @ts-expect-error schema discriminator must match the registration name
  defineModel({ name: "reviewalpha", schema: betaSchema, parse: parseBeta })
  // @ts-expect-error parser discriminator must match the schema output
  defineModel({ name: "reviewalpha", schema: alphaSchema, parse: parseBeta })
  defineModel({
    name: "reviewalpha",
    schema: alphaSchema,
    // @ts-expect-error parser must include all required schema output properties
    parse: () => ({ fn: "reviewalpha" as const }),
  })
  // @ts-expect-error a schema with a broad string discriminator is not a named model
  defineModel({ name: "reviewalpha", schema: broadFnSchema, parse: parseAlpha })
  // @ts-expect-error a union schema cannot be registered under one model name
  defineModel({ name: "reviewalpha", schema: unionFnSchema, parse: parseAlpha })

  const broadName: string = "reviewalpha"
  const unionName = Math.random() ? "reviewalpha" : "reviewbeta"
  // @ts-expect-error model names must be single literals, not broad strings
  defineModel({ name: broadName, schema: alphaSchema, parse: parseAlpha })
  // @ts-expect-error model names must be single literals, not name unions
  defineModel({ name: unionName, schema: unionFnSchema, parse: parseAlpha })
  defineModel<"reviewalpha" | "reviewbeta", typeof unionFnSchema>({
    // @ts-expect-error explicit union generic arguments cannot widen the contract
    name: "reviewalpha",
    schema: unionFnSchema,
    parse: parseAlpha,
  })

  const registry = new ModelRegistry()
  registry.register(alpha)
  registry.register({
    name: "reviewalpha",
    // @ts-expect-error direct registration must not infer a union from a mismatched schema
    schema: betaSchema,
    // @ts-expect-error a mismatched parser cannot widen the registration name
    parse: parseBeta,
  })
  registry.register({
    name: "reviewalpha",
    schema: alphaSchema,
    // @ts-expect-error direct registration checks required parser output properties
    parse: () => ({ fn: "reviewalpha" as const }),
  })
  // @ts-expect-error direct registration also rejects a broad name
  registry.register({ name: broadName, schema: alphaSchema, parse: parseAlpha })
  registry.register({
    // @ts-expect-error direct registration also rejects a union name and schema
    name: unionName,
    schema: unionFnSchema,
    parse: parseAlpha,
  })

  const stringTemplateName = "reviewalpha" as `review${string}`
  const stringTemplate = {
    name: stringTemplateName,
    schema: z.object({ fn: z.custom<typeof stringTemplateName>() }),
    parse: () => ({ fn: stringTemplateName }),
  }
  // @ts-expect-error an infinite string suffix is not a single literal name
  defineModel(stringTemplate)
  // @ts-expect-error direct registration rejects an infinite string suffix
  registry.register(stringTemplate)

  const numberTemplateName = "review1" as `review${number}`
  const numberTemplate = {
    name: numberTemplateName,
    schema: z.object({ fn: z.custom<typeof numberTemplateName>() }),
    parse: () => ({ fn: numberTemplateName }),
  }
  // @ts-expect-error an infinite numeric suffix is not a single literal name
  defineModel(numberTemplate)
  // @ts-expect-error direct registration rejects an infinite numeric suffix
  registry.register(numberTemplate)

  const lowercaseTemplateName = "reviewalpha" as `review${Lowercase<string>}`
  const lowercaseTemplate = {
    name: lowercaseTemplateName,
    schema: z.object({ fn: z.custom<typeof lowercaseTemplateName>() }),
    parse: () => ({ fn: lowercaseTemplateName }),
  }
  // @ts-expect-error an infinite lowercase suffix is not a single literal name
  defineModel(lowercaseTemplate)
  // @ts-expect-error direct registration rejects an infinite lowercase suffix
  registry.register(lowercaseTemplate)

  const transformedSchema = z.string().transform((value) => ({
    fn: "reviewtransformed" as const,
    length: value.length,
  }))
  const transformed = defineModel({
    name: "reviewtransformed",
    schema: transformedSchema,
    parse: (params) => transformedSchema.parse(params.string),
  })
  const transformedLength: number = transformed.parse({
    fn: "reviewtransformed",
    string: "value",
  }).length
  void transformedLength
}

/** Check union discrimination without requiring a fixed number of models. */
export function assertGeneratedModelTypes(model: ModelDefinition): void {
  if (model.fn === "flexscreen") {
    const screen: FlexScreenModelDefinition = model
    const width: number | undefined = model.width
    void [screen, width]
    // @ts-expect-error narrowing cannot expose a field from a different model
    model.headHeight
  }
  const builtinName: ModelDefinition["fn"] = model.fn
  void builtinName
  // @ts-expect-error unknown models are not part of the generated definition union
  const unknownName: ModelDefinition["fn"] = "reviewunregistered"
  void unknownName
}
