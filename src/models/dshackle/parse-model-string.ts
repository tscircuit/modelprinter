import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseDShackleMetricSize } from "./normalize"
import { dShackleModelDefinitionSchema } from "./schema"

const lengths = {
  innerw: "innerWidth",
  innerh: "innerHeight",
  stock: "stockDiameter",
  crownr: "crownRadius",
  pin: "pinDiameter",
  eyet: "eyeThickness",
} as const

export function parseDShackleModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "dshackle" || tokens[0]?.toLowerCase() !== "dshackle") {
    throw new Error("Expected dshackle without an inline value")
  }
  const props: Record<string, unknown> = { fn: "dshackle" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for dshackle`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "pinm") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "pinThreadDiameter")) {
        throw new Error("Duplicate dshackle pinm")
      }
      props.pinThreadDiameter = parseDShackleMetricSize(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate dshackle property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown dshackle token "${token}"`)
    }
  }
  return dShackleModelDefinitionSchema.parse(props)
}
