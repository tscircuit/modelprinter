import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { wireSpliceModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  h: "height",
  d: "depth",
  portid: "portInnerDiameter",
  portp: "portPitch",
} as const

export function parseWireSpliceModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "wiresplice" || tokens[0]?.toLowerCase() !== "wiresplice") {
    throw new Error("Expected wiresplice without an inline value")
  }
  const props: Record<string, unknown> = { fn: "wiresplice" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for wiresplice`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "snapbracket") {
      if (Object.hasOwn(props, "snapBracket")) {
        throw new Error("Duplicate wiresplice snapbracket flag")
      }
      props.snapBracket = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "ports") {
      if (!tokenArg) throw new Error(`Missing port count in "${token}"`)
      if (Object.hasOwn(props, "ports")) {
        throw new Error("Duplicate wiresplice ports")
      }
      props.ports = parseGearInteger(tokenArg, "ports")
    } else if (tokenName === "levers") {
      if (!tokenArg) throw new Error(`Missing lever count in "${token}"`)
      if (Object.hasOwn(props, "levers")) {
        throw new Error("Duplicate wiresplice levers")
      }
      props.levers = parseGearInteger(tokenArg, "levers")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate wiresplice property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown wiresplice token "${token}"`)
    }
  }
  return wireSpliceModelDefinitionSchema.parse(props)
}
