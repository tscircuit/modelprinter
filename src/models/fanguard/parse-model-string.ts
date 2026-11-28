import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { fanGuardModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  wire: "wireDiameter",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hpx: "holePitchX",
  hpy: "holePitchY",
} as const

export function parseFanGuardModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "fanguard" || tokens[0]?.toLowerCase() !== "fanguard") {
    throw new Error("Expected fanguard without an inline value")
  }
  const props: Record<string, unknown> = { fn: "fanguard" }
  for (const token of tokens.slice(1)) {
    const ringTuple = token.match(/^ringod\(([^()]+)\)$/i)
    if (ringTuple) {
      if (Object.hasOwn(props, "ringOuterDiameters")) {
        throw new Error("Duplicate ringod(...) in fanguard string")
      }
      const items = ringTuple[1]!.split(",").map((s) => s.trim())
      props.ringOuterDiameters = items
      continue
    }
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hp(...) in fanguard string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for fanguard`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName === "rings") {
      property = "rings"
      parsed = parseGearInteger(tokenArg, "rings")
    } else if (tokenName === "spokes") {
      property = "spokes"
      parsed = parseGearInteger(tokenArg, "spokes")
    } else if (tokenName === "tabs") {
      property = "tabs"
      parsed = parseGearInteger(tokenArg, "tabs")
    } else if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else {
      throw new Error(`Unknown fanguard token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate fanguard property "${property}"`)
    }
    props[property] = parsed
  }
  return fanGuardModelDefinitionSchema.parse(props)
}
