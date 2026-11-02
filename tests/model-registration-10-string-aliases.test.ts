import { expect, test } from "bun:test"
import { z } from "zod"
import { ModelRegistry, parseModelStringParams } from "../src"

test("string matchers only select unregistered spellings and reject ambiguous aliases", () => {
  const registry = new ModelRegistry()
  const registration = {
    name: "first" as const,
    schema: z.object({ fn: z.literal("first") }),
    parse: () => ({ fn: "first" as const }),
    matchesString: (value: string): boolean => value === "alternate",
    normalizeString: () => "first",
  }
  registry.register(registration)
  registration.matchesString = () => false
  expect(registry.normalize(parseModelStringParams("alternate")).fn).toBe(
    "first",
  )
  expect(registry.normalize(parseModelStringParams("unknown")).fn).toBe(
    "unknown",
  )
  registry.register({
    name: "second",
    schema: z.object({ fn: z.literal("second") }),
    parse: () => ({ fn: "second" }),
    matchesString: (value) => value === "alternate" || value === "first",
    normalizeString: () => "second",
  })
  expect(registry.normalize(parseModelStringParams("first")).fn).toBe("first")
  expect(() => registry.normalize(parseModelStringParams("alternate"))).toThrow(
    /matches multiple registered models/,
  )
})
