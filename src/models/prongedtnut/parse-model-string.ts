import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseProngedTNutMetricThread } from "./normalize"
import { prongedTNutModelDefinitionSchema } from "./schema"

const lengths = {
  barrelod: "barrelOuterDiameter",
  l: "length",
  flangeod: "flangeOuterDiameter",
  flangeh: "flangeHeight",
  prongl: "prongLength",
  prongw: "prongWidth",
} as const

export function parseProngedTNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "prongedtnut" || tokens[0]?.toLowerCase() !== "prongedtnut") {
    throw new Error("Expected prongedtnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "prongedtnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for prongedtnut`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "pointedtip") {
      if (Object.hasOwn(props, "pointedTip")) {
        throw new Error("Duplicate prongedtnut pointedtip flag")
      }
      props.pointedTip = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate prongedtnut thread size")
      }
      props.threadDiameter = parseProngedTNutMetricThread(tokenArg)
    } else if (tokenName === "prongs") {
      if (!tokenArg) throw new Error(`Missing prong count in "${token}"`)
      if (Object.hasOwn(props, "prongs")) {
        throw new Error("Duplicate prongedtnut prongs")
      }
      props.prongs = parseGearInteger(tokenArg, "prongs")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate prongedtnut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown prongedtnut token "${token}"`)
    }
  }
  return prongedTNutModelDefinitionSchema.parse(props)
}
