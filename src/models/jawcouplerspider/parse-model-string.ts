import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { jawCouplerSpiderModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  id: "innerDiameter",
  w: "width",
  hubclearance: "hubClearance",
} as const

export function parseJawCouplerSpiderModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "jawcouplerspider" ||
    tokens[0]?.toLowerCase() !== "jawcouplerspider"
  ) {
    throw new Error("Expected jawcouplerspider without an inline value")
  }
  const props: Record<string, unknown> = { fn: "jawcouplerspider" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for jawcouplerspider`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "curvedlobe") {
      if (Object.hasOwn(props, "curvedLobe")) {
        throw new Error("Duplicate jawcouplerspider curvedlobe flag")
      }
      props.curvedLobe = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "lobes") {
      if (!tokenArg) throw new Error(`Missing lobe count in "${token}"`)
      if (Object.hasOwn(props, "lobes")) {
        throw new Error("Duplicate jawcouplerspider lobes")
      }
      props.lobes = parseGearInteger(tokenArg, "lobes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate jawcouplerspider property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown jawcouplerspider token "${token}"`)
    }
  }
  return jawCouplerSpiderModelDefinitionSchema.parse(props)
}
