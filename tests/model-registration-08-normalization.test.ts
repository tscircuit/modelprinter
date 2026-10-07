import { expect, test } from "bun:test"
import { z } from "zod"
import { defineModel, ModelRegistry } from "../src/model-registry"
import { parseModelStringParams } from "../src/parse-model-string"

test("optional registration normalizer is isolated, snapshotted, and preserves dispatch", () => {
  const schema = z.object({ fn: z.literal("alpha") })
  let parsed = 0
  const descriptor = defineModel({
    name: "alpha",
    schema,
    parse: () => {
      parsed++
      return schema.parse({ fn: "alpha" })
    },
    normalizeString: () => "alpha_w7mm",
  })
  const registry = new ModelRegistry()
  registry.register(descriptor)
  const mutable = descriptor as { normalizeString?: (value: string) => string }
  mutable.normalizeString = () => "beta"
  const raw = parseModelStringParams("alpha7")
  expect(registry.normalize(raw)).toMatchObject({
    fn: "alpha",
    w: "7mm",
    string: "alpha_w7mm",
  })
  expect(parsed).toBe(0)
  registry.parse(registry.normalize(raw))
  expect(parsed).toBe(1)
  const missing = parseModelStringParams("missing7")
  expect(registry.normalize(missing)).toBe(missing)
  const plain = new ModelRegistry()
  plain.register({ name: "alpha", schema, parse: descriptor.parse })
  expect(plain.normalize(raw)).toBe(raw)
  for (const output of ["beta", 7]) {
    const invalid = new ModelRegistry()
    invalid.register({
      ...descriptor,
      normalizeString: (() => output) as (value: string) => string,
    })
    expect(() => invalid.normalize(raw)).toThrow()
  }
})
