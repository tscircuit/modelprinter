import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { fixturePlateModelDefinitionSchema } from "./schema"
const aliases = {
  l: "length",
  w: "width",
  t: "thickness",
  hole: "holeDiameter",
  cols: "columns",
  rows: "rows",
  pitch: "pitch",
  edgex: "edgeX",
  edgey: "edgeY",
  length: "length",
  width: "width",
  thickness: "thickness",
  holediameter: "holeDiameter",
  columns: "columns",
} as const
export function parseFixturePlateModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "fixtureplate" || name?.toLowerCase() !== "fixtureplate")
    throw new Error("Expected fixtureplate without inline values")
  const props: Record<string, unknown> = { fn: "fixtureplate" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed fixtureplate token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate fixtureplate property "${property}"`)
    props[property] = ["columns", "rows"].includes(property)
      ? /^\d+$/.test(value)
        ? Number(value)
        : Number.NaN
      : value
  }
  return fixturePlateModelDefinitionSchema.parse(props)
}
