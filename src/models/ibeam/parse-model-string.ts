import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { iBeamModelDefinitionSchema } from "./schema"

const lengths = {
  h: "height",
  w: "width",
  web: "webThickness",
  flange: "flangeThickness",
  rootr: "rootRadius",
  l: "length",
} as const

export function parseIBeamModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "ibeam" || tokens[0]?.toLowerCase() !== "ibeam") {
    throw new Error("Expected ibeam without an inline value")
  }
  const props: Record<string, unknown> = { fn: "ibeam" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for ibeam`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "ipe80") {
      if (Object.hasOwn(props, "ipe80")) {
        throw new Error("Duplicate ibeam ipe80 flag")
      }
      props.ipe80 = true
      continue
    }
    if (lower === "en10365") {
      if (Object.hasOwn(props, "en10365")) {
        throw new Error("Duplicate ibeam en10365 flag")
      }
      props.en10365 = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate ibeam property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown ibeam token "${token}"`)
    }
  }
  return iBeamModelDefinitionSchema.parse(props)
}
