import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { stepBlockModelDefinitionSchema } from "./schema"
const aliases = {
  l: "length",
  w: "width",
  h: "height",
  steps: "steps",
  steprun: "stepRun",
  steprise: "stepRise",
  length: "length",
  width: "width",
  height: "height",
} as const
export function parseStepBlockModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "stepblock" || name?.toLowerCase() !== "stepblock")
    throw new Error("Expected stepblock without inline values")
  const props: Record<string, unknown> = { fn: "stepblock" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed stepblock token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate stepblock property "${property}"`)
    props[property] = ["steps"].includes(property)
      ? /^\d+$/.test(value)
        ? Number(value)
        : Number.NaN
      : value
  }
  return stepBlockModelDefinitionSchema.parse(props)
}
