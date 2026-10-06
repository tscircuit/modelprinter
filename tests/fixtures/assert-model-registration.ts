import { expect } from "bun:test"
import { readFile } from "node:fs/promises"
import { z } from "zod"
import * as publicApi from "../../src"
import { builtinModels, registerAllModels } from "../../src/generated/models"
import {
  defineModel,
  ModelRegistry,
  type ModelRegistration,
} from "../../src/model-registry"
import { parseModelStringParams } from "../../src/parse-model-string"

export const legacyModelNames = [
  "hexbolt",
  "helicalgear",
  "nema",
  "sheetmetal",
  "flexscreen",
  "hexsocketbolt",
  "spurgear",
  "wormgear",
]

function alphaModel(value = 7) {
  const schema = z.object({ fn: z.literal("alpha"), value: z.number() })
  return defineModel({
    name: "alpha",
    schema,
    parse: () => schema.parse({ fn: "alpha", value }),
  })
}

export function assertRegistryIsolation() {
  const first = new ModelRegistry()
  const second = new ModelRegistry()
  const publicNames = publicApi.mp.getModelNames()
  expect<unknown>(first.getModelNames()).toEqual([])
  expect<unknown>(second.getModelNames()).toEqual([])
  first.register(alphaModel())
  expect<unknown>(first.getModelNames()).toEqual(["alpha"])
  expect<unknown>(second.getModelNames()).toEqual([])
  expect<unknown>(first.parse(parseModelStringParams("alpha"))).toEqual({
    fn: "alpha",
    value: 7,
  })
  expect<unknown>(() => second.parse(parseModelStringParams("alpha"))).toThrow(
    'Unsupported modelprinter function "alpha"',
  )
  second.register(alphaModel(11))
  expect<unknown>(second.parse(parseModelStringParams("alpha"))).toEqual({
    fn: "alpha",
    value: 11,
  })
  const names = first.getModelNames()
  names.push("tampered")
  expect<unknown>(first.getModelNames()).toEqual(["alpha"])
  expect<unknown>(publicApi.mp.getModelNames()).toEqual(publicNames)

  const third = new ModelRegistry()
  const mutableDescriptor = { ...alphaModel(13) }
  third.register(mutableDescriptor)
  mutableDescriptor.parse = alphaModel(19).parse
  expect<unknown>(third.parse(parseModelStringParams("alpha"))).toEqual({
    fn: "alpha",
    value: 13,
  })
}

export function assertRegistryRegistrationErrors() {
  const registry = new ModelRegistry()
  registry.register(alphaModel())
  expect<unknown>(() => registry.register(alphaModel(99))).toThrow(
    'Modelprinter function "alpha" is already registered',
  )
  expect<unknown>(registry.getModelNames()).toEqual(["alpha"])
  expect<unknown>(registry.parse(parseModelStringParams("alpha"))).toEqual({
    fn: "alpha",
    value: 7,
  })
  for (const name of [
    "",
    "Alpha",
    "alpha-beta",
    "alpha1",
    "alpha_beta",
    null,
    undefined,
    new String("alpha"),
  ]) {
    // Untrusted JavaScript callers can bypass the compile-time literal guard.
    const invalid = { ...alphaModel(), name } as unknown as ReturnType<
      typeof alphaModel
    >
    expect<unknown>(() => registry.register(invalid)).toThrow(
      "Model names must contain only lowercase letters",
    )
  }
  expect<unknown>(registry.getModelNames()).toEqual(["alpha"])
}

export function assertRegistryParserBoundary() {
  let transformations = 0
  let calls = 0
  let output: { fn: "alpha"; value: number } | undefined
  const schema = z
    .object({ fn: z.literal("alpha"), value: z.number() })
    .transform((input) => {
      transformations++
      return { ...input, value: input.value + 1 }
    })
  const registry = new ModelRegistry()
  registry.register(
    defineModel({
      name: "alpha",
      schema,
      parse: () => {
        calls++
        output = schema.parse({ fn: "alpha", value: 4 })
        return output
      },
    }),
  )
  const actual = registry.parse(parseModelStringParams("alpha"))
  expect<unknown>(actual).toBe(output)
  expect<unknown>(actual).toEqual({ fn: "alpha", value: 5 })
  expect<unknown>(calls).toBe(1)
  expect<unknown>(transformations).toBe(1)

  for (const invalid of [
    null,
    undefined,
    12,
    "alpha",
    [],
    [{ fn: "alpha" }],
    {},
    { fn: "beta", value: 4 },
  ]) {
    const invalidRegistry = new ModelRegistry()
    const invalidDescriptor = {
      ...alphaModel(),
      parse: () => invalid,
    } as unknown as ModelRegistration<
      "alpha",
      ReturnType<typeof alphaModel>["schema"]
    >
    invalidRegistry.register(invalidDescriptor)
    expect<unknown>(() =>
      invalidRegistry.parse(parseModelStringParams("alpha")),
    ).toThrow('Parser for "alpha" must return a model with fn "alpha"')
  }

  const failure = new Error("the model parser rejected its parameters")
  const throwingRegistry = new ModelRegistry()
  throwingRegistry.register({
    ...alphaModel(),
    parse: () => {
      throw failure
    },
  })
  expect<unknown>(() =>
    throwingRegistry.parse(parseModelStringParams("alpha")),
  ).toThrow(failure)
}

export function assertSynchronousBuiltins() {
  const names = publicApi.mp.getModelNames()
  expect<unknown>(names.slice(0, legacyModelNames.length)).toEqual(
    legacyModelNames,
  )
  expect<unknown>(new Set(names).size).toBe(names.length)
  expect<unknown>(names).toEqual(builtinModels.map((model) => model.name))
  const explicit = new ModelRegistry()
  registerAllModels(explicit)
  expect<unknown>(explicit.getModelNames()).toEqual(names)
  expect<unknown>(new ModelRegistry().getModelNames()).toEqual([])
  expect<unknown>(publicApi.mp).toBe(publicApi.modelprinter)
  expect<unknown>(publicApi.string("spurgear").json()).toEqual(
    publicApi.parseModelString("spurgear"),
  )
  const returnedNames = publicApi.mp.getModelNames()
  returnedNames.reverse()
  expect<unknown>(publicApi.mp.getModelNames()).toEqual(names)
  expect<unknown>(publicApi.modelDefinitionSchema).toBeInstanceOf(z.ZodType)
  expect<unknown>(publicApi.flexScreenModelPropsSchema).toBeInstanceOf(
    z.ZodType,
  )
  for (const model of builtinModels) {
    expect<unknown>(model.schema).toBeInstanceOf(z.ZodType)
  }
}

export function assertUnsupportedErrors() {
  const source = "registryfixturemissing_w12mm"
  const raw = publicApi.mp.string(source).params()
  expect<unknown>(raw).toMatchObject({
    fn: "registryfixturemissing",
    w: "12mm",
    string: source,
  })
  const error = 'Unsupported modelprinter function "registryfixturemissing"'
  expect<unknown>(() => publicApi.mp.string(source).json()).toThrow(error)
  expect<unknown>(() => publicApi.parseModelString(source)).toThrow(error)
  expect<unknown>(() => new ModelRegistry().parse(raw)).toThrow(error)
  expect<unknown>(() =>
    publicApi.parseModelString("hexsocketbolt_m0_l6mm"),
  ).toThrow()
}

export async function assertLegacyModelOutputs() {
  const baseline = JSON.parse(
    await readFile(
      new URL("./registration-baselines.json", import.meta.url),
      "utf8",
    ),
  ) as { source: string; json: Record<string, unknown> }[]
  const registry = new ModelRegistry()
  registerAllModels(registry)
  expect<unknown>(baseline.map((entry) => entry.json.fn)).toEqual(
    legacyModelNames,
  )
  for (const { source, json } of baseline) {
    expect<unknown>(publicApi.mp.string(source).json()).toEqual(json)
    expect<unknown>(publicApi.parseModelString(source)).toEqual(json)
    expect<unknown>(registry.parse(parseModelStringParams(source))).toEqual(
      json,
    )
  }
}
