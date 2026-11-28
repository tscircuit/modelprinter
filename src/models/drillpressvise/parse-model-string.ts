import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { drillPressViseModelDefinitionSchema } from "./schema"

const lengths = {
  jaww: "jawWidth",
  jawh: "jawHeight",
  open: "maxOpening",
  bodyl: "bodyLength",
  bodyw: "bodyWidth",
  h: "height",
  slotw: "slotWidth",
  slotl: "slotLength",
  pitchx: "pitchX",
  pitchy: "pitchY",
} as const

export function parseDrillPressViseModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "drillpressvise" ||
    tokens[0]?.toLowerCase() !== "drillpressvise"
  ) {
    throw new Error("Expected drillpressvise without an inline value")
  }
  const props: Record<string, unknown> = { fn: "drillpressvise" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for drillpressvise`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "mountslots") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "mountSlots")) {
        throw new Error("Duplicate drillpressvise mountslots")
      }
      props.mountSlots = parseGearInteger(tokenArg, "mountslots")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate drillpressvise property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown drillpressvise token "${token}"`)
    }
  }
  return drillPressViseModelDefinitionSchema.parse(props)
}
