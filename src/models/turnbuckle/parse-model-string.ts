import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseTurnbuckleMetricThread } from "./normalize"
import { turnbuckleModelDefinitionSchema } from "./schema"

const lengths = {
  bodyl: "bodyLength",
  bodyw: "bodyWidth",
  bodyh: "bodyHeight",
  openl: "openLength",
  openw: "openWidth",
  eyesid: "eyeInnerDiameter",
  eyewire: "eyeWireDiameter",
  endl: "endLength",
} as const

export function parseTurnbuckleModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "turnbuckle" || tokens[0]?.toLowerCase() !== "turnbuckle") {
    throw new Error("Expected turnbuckle without an inline value")
  }
  const props: Record<string, unknown> = { fn: "turnbuckle" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for turnbuckle`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "opposedthread") {
      if (Object.hasOwn(props, "opposedThread")) {
        throw new Error("Duplicate turnbuckle opposedthread flag")
      }
      props.opposedThread = true
      continue
    }
    if (lower === "centered") {
      if (Object.hasOwn(props, "centered")) {
        throw new Error("Duplicate turnbuckle centered flag")
      }
      props.centered = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate turnbuckle thread size")
      }
      props.threadDiameter = parseTurnbuckleMetricThread(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate turnbuckle property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown turnbuckle token "${token}"`)
    }
  }
  return turnbuckleModelDefinitionSchema.parse(props)
}
