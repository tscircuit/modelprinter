import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseSleeveAnchorMetricThread } from "./normalize"
import { sleeveAnchorModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  sleeveod: "sleeveOuterDiameter",
  wall: "wallThickness",
  sleevel: "sleeveLength",
  slotl: "slotLength",
  coneod: "coneOuterDiameter",
  af: "acrossFlats",
} as const

export function parseSleeveAnchorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "sleeveanchor" ||
    tokens[0]?.toLowerCase() !== "sleeveanchor"
  ) {
    throw new Error("Expected sleeveanchor without an inline value")
  }
  const props: Record<string, unknown> = { fn: "sleeveanchor" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for sleeveanchor`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "hexhead") {
      if (Object.hasOwn(props, "hexHead")) {
        throw new Error("Duplicate sleeveanchor hexhead flag")
      }
      props.hexHead = true
      continue
    }
    if (lower === "unset") {
      if (Object.hasOwn(props, "unset")) {
        throw new Error("Duplicate sleeveanchor unset flag")
      }
      props.unset = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate sleeveanchor thread size")
      }
      props.threadDiameter = parseSleeveAnchorMetricThread(tokenArg)
    } else if (tokenName === "slots") {
      if (!tokenArg) throw new Error(`Missing slot count in "${token}"`)
      if (Object.hasOwn(props, "slots")) {
        throw new Error("Duplicate sleeveanchor slots")
      }
      props.slots = parseGearInteger(tokenArg, "slots")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate sleeveanchor property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown sleeveanchor token "${token}"`)
    }
  }
  return sleeveAnchorModelDefinitionSchema.parse(props)
}
