import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cartridgeFuseModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  l: "length",
  length: "length",
  capl: "capLength",
} as const

export function parseCartridgeFuseModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "cartridgefuse" ||
    tokens[0]?.toLowerCase() !== "cartridgefuse"
  ) {
    throw new Error("Expected cartridgefuse without an inline value")
  }
  const props: Record<string, unknown> = { fn: "cartridgefuse" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for cartridgefuse`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "cartridge5x20") {
      property = "cartridge5x20"
      parsed = true
    } else if (lower === "ceramiccylinder") {
      property = "ceramicCylinder"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown cartridgefuse token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate cartridgefuse property "${property}"`)
    }
    props[property] = parsed
  }
  return cartridgeFuseModelDefinitionSchema.parse(props)
}
