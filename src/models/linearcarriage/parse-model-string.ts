import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { linearCarriageModelDefinitionSchema } from "./schema"
const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  l: "length",
  length: "length",
  railw: "railWidth",
  railwidth: "railWidth",
  railh: "railHeight",
  railheight: "railHeight",
  baseh: "railBaseHeight",
  railbaseheight: "railBaseHeight",
  neckw: "railNeckWidth",
  railneckwidth: "railNeckWidth",
  neckh: "railNeckHeight",
  railneckheight: "railNeckHeight",
  clearance: "clearance",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  holex: "holePitchX",
  holepitchx: "holePitchX",
  holey: "holePitchY",
  holepitchy: "holePitchY",
  holedepth: "holeDepth",
} as const
export function parseLinearCarriageModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "linearcarriage" || tokens[0]?.toLowerCase() !== raw.fn)
    throw new Error("Expected linearcarriage without an inline value")
  const props: Record<string, unknown> = { fn: "linearcarriage" }
  for (const token of tokens.slice(1)) {
    const [name, value] = parseGearToken(token)
    let property: string
    let parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "holes" || name === "holecount") {
      property = "holeCount"
      parsed = parseGearInteger(value, "Hole count")
    } else throw new Error(`Unknown linearcarriage token "${token}"`)
    if (property in props)
      throw new Error(`Repeated linearcarriage property "${property}"`)
    props[property] = parsed
  }
  return linearCarriageModelDefinitionSchema.parse(props)
}
