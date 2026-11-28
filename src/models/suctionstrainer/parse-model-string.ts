import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { suctionStrainerModelDefinitionSchema } from "./schema"

const lengths = {
  npt: "portNominal",
  od: "outerDiameter",
  l: "length",
  perfd: "perforationDiameter",
  perfp: "perforationPitch",
} as const

export function parseSuctionStrainerModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "suctionstrainer" ||
    tokens[0]?.toLowerCase() !== "suctionstrainer"
  ) {
    throw new Error("Expected suctionstrainer without an inline value")
  }
  const props: Record<string, unknown> = { fn: "suctionstrainer" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for suctionstrainer`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "cylindrical") {
      if (Object.hasOwn(props, "cylindrical")) {
        throw new Error("Duplicate suctionstrainer cylindrical flag")
      }
      props.cylindrical = true
      continue
    }
    if (lower === "flatcap") {
      if (Object.hasOwn(props, "flatCap")) {
        throw new Error("Duplicate suctionstrainer flatcap flag")
      }
      props.flatCap = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate suctionstrainer property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown suctionstrainer token "${token}"`)
    }
  }
  return suctionStrainerModelDefinitionSchema.parse(props)
}
