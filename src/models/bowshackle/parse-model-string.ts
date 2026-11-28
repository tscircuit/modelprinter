import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseBowShackleMetricSize } from "./normalize"
import { bowShackleModelDefinitionSchema } from "./schema"

const lengths = {
  innerw: "innerWidth",
  innerh: "innerHeight",
  stock: "stockDiameter",
  bowr: "bowRadius",
  pin: "pinDiameter",
  eyet: "eyeThickness",
} as const

export function parseBowShackleModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "bowshackle" || tokens[0]?.toLowerCase() !== "bowshackle") {
    throw new Error("Expected bowshackle without an inline value")
  }
  const props: Record<string, unknown> = { fn: "bowshackle" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for bowshackle`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "pinm") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "pinThreadDiameter")) {
        throw new Error("Duplicate bowshackle pinm")
      }
      props.pinThreadDiameter = parseBowShackleMetricSize(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate bowshackle property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown bowshackle token "${token}"`)
    }
  }
  return bowShackleModelDefinitionSchema.parse(props)
}
