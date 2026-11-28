import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { rockerSwitchModelDefinitionSchema } from "./schema"

const lengths = {
  cutoutl: "cutoutLength",
  cutoutw: "cutoutWidth",
  bodyd: "bodyDepth",
  flange: "flangeBorder",
  tabw: "tabWidth",
  tabt: "tabThickness",
} as const

export function parseRockerSwitchModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "rockerswitch" ||
    tokens[0]?.toLowerCase() !== "rockerswitch"
  ) {
    throw new Error("Expected rockerswitch without an inline value")
  }
  const props: Record<string, unknown> = { fn: "rockerswitch" }
  for (const token of tokens.slice(1)) {
    const cutoutTuple = token.match(/^cutout\(([^,()]+),([^,()]+)\)$/i)
    if (cutoutTuple) {
      const [, rawL = "", rawW = ""] = cutoutTuple
      if (
        Object.hasOwn(props, "cutoutLength") ||
        Object.hasOwn(props, "cutoutWidth")
      ) {
        throw new Error("Duplicate cutout(...) in rockerswitch string")
      }
      props.cutoutLength = rawL.trim()
      props.cutoutWidth = rawW.trim()
      continue
    }
    const tabsTuple = token.match(/^tabs\(([^,()]+),([^,()]+)\)$/i)
    if (tabsTuple) {
      const [, rawW = "", rawT = ""] = tabsTuple
      if (
        Object.hasOwn(props, "tabWidth") ||
        Object.hasOwn(props, "tabThickness")
      ) {
        throw new Error("Duplicate tabs(...) in rockerswitch string")
      }
      props.tabWidth = rawW.trim()
      props.tabThickness = rawT.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for rockerswitch`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "curvedrocker") {
      property = "curvedRocker"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "clips") {
        property = "clips"
        parsed = parseGearInteger(tokenArg, "clips")
      } else if (tokenName === "contacts") {
        property = "contacts"
        parsed = parseGearInteger(tokenArg, "contacts")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown rockerswitch token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate rockerswitch property "${property}"`)
    }
    props[property] = parsed
  }
  return rockerSwitchModelDefinitionSchema.parse(props)
}
