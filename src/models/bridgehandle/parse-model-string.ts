import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { bridgeHandleModelDefinitionSchema } from "./schema"

const lengths = {
  p: "pitch",
  pitch: "pitch",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  gript: "gripThickness",
  gripthickness: "gripThickness",
  threadpitch: "threadPitch",
} as const

export function parseBridgeHandleModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "bridgehandle" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected bridgehandle without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "bridgehandle" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "righthanded") {
      property = "rightHanded"
      parsed = true
    } else if (lower === "threads" || lower === "nothreads") {
      property = "showThreads"
      parsed = lower === "threads"
    } else if (/^m\d+(?:\.\d+)?$/i.test(token)) {
      property = "metricSize"
      parsed = `M${token.slice(1)}`
    } else if (/^threadclass\([^()]+\)$/i.test(token)) {
      property = "threadClass"
      parsed = token.slice(token.indexOf("(") + 1, -1).toUpperCase()
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "holes" || tokenName === "holecount") {
        property = "holeCount"
        parsed = parseGearInteger(tokenArg, "holeCount")
      } else if (tokenName === "footsize") {
        const tupleMatch = tokenArg.match(/^\(([^(),]+),([^(),]+)\)$/)
        if (!tupleMatch) {
          throw new Error("footsize requires two parenthesized lengths")
        }
        const [, footL = "", footW = ""] = tupleMatch
        property = "footSize"
        parsed = [footL.trim(), footW.trim()]
      } else {
        throw new Error(`Unknown bridge handle token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate bridge handle property "${property}"`)
    }
    props[property] = parsed
  }
  return bridgeHandleModelDefinitionSchema.parse(props)
}
