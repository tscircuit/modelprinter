import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseLAnchorBoltMetricThread } from "./normalize"
import { lAnchorBoltModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  leg: "legLength",
  bendr: "bendRadius",
  threadl: "threadLength",
} as const

export function parseLAnchorBoltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "lanchorbolt" || tokens[0]?.toLowerCase() !== "lanchorbolt") {
    throw new Error("Expected lanchorbolt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "lanchorbolt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for lanchorbolt`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate lanchorbolt thread size")
      }
      props.threadDiameter = parseLAnchorBoltMetricThread(tokenArg)
    } else if (tokenName === "bend") {
      if (!tokenArg) throw new Error(`Missing bend angle in "${token}"`)
      if (Object.hasOwn(props, "bendAngle")) {
        throw new Error("Duplicate lanchorbolt bend")
      }
      props.bendAngle = parseGearAngle(tokenArg, "bend")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate lanchorbolt property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown lanchorbolt token "${token}"`)
    }
  }
  return lAnchorBoltModelDefinitionSchema.parse(props)
}
