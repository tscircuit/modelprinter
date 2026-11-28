import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { externalGearPumpModelDefinitionSchema } from "./schema"

const lengths = {
  npt: "portNominal",
  w: "width",
  l: "length",
  h: "height",
  shaftod: "shaftOuterDiameter",
  flangew: "flangeWidth",
  flanget: "flangeThickness",
  holep: "holePitch",
  holed: "holeDiameter",
} as const

export function parseExternalGearPumpModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "externalgearpump" ||
    tokens[0]?.toLowerCase() !== "externalgearpump"
  ) {
    throw new Error("Expected externalgearpump without an inline value")
  }
  const props: Record<string, unknown> = { fn: "externalgearpump" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for externalgearpump`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "frontflange") {
      if (Object.hasOwn(props, "frontFlange")) {
        throw new Error("Duplicate externalgearpump frontflange flag")
      }
      props.frontFlange = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate externalgearpump property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown externalgearpump token "${token}"`)
    }
  }
  return externalGearPumpModelDefinitionSchema.parse(props)
}
