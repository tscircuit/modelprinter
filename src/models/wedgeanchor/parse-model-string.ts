import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseWedgeAnchorMetricThread } from "./normalize"
import { wedgeAnchorModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  threadl: "threadLength",
  clipod: "clipOuterDiameter",
  clipl: "clipLength",
  coneod: "coneOuterDiameter",
  conel: "coneLength",
} as const

export function parseWedgeAnchorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "wedgeanchor" || tokens[0]?.toLowerCase() !== "wedgeanchor") {
    throw new Error("Expected wedgeanchor without an inline value")
  }
  const props: Record<string, unknown> = { fn: "wedgeanchor" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for wedgeanchor`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "headless") {
      if (Object.hasOwn(props, "headless")) {
        throw new Error("Duplicate wedgeanchor headless flag")
      }
      props.headless = true
      continue
    }
    if (lower === "unset") {
      if (Object.hasOwn(props, "unset")) {
        throw new Error("Duplicate wedgeanchor unset flag")
      }
      props.unset = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate wedgeanchor thread size")
      }
      props.threadDiameter = parseWedgeAnchorMetricThread(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate wedgeanchor property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown wedgeanchor token "${token}"`)
    }
  }
  return wedgeAnchorModelDefinitionSchema.parse(props)
}
