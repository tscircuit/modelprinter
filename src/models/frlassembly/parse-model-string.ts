import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { frlAssemblyModelDefinitionSchema } from "./schema"

const lengths = {
  npt: "portNominal",
  w: "width",
  h: "height",
  d: "depth",
  bowlod: "bowlOuterDiameter",
  holep: "holePitch",
  holed: "holeDiameter",
} as const

export function parseFrlAssemblyModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "frlassembly" || tokens[0]?.toLowerCase() !== "frlassembly") {
    throw new Error("Expected frlassembly without an inline value")
  }
  const props: Record<string, unknown> = { fn: "frlassembly" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for frlassembly`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "backrail") {
      if (Object.hasOwn(props, "backRail")) {
        throw new Error("Duplicate frlassembly backrail flag")
      }
      props.backRail = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate frlassembly holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate frlassembly property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown frlassembly token "${token}"`)
    }
  }
  return frlAssemblyModelDefinitionSchema.parse(props)
}
