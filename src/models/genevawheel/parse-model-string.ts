import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { genevaWheelModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  w: "width",
  width: "width",
  bore: "boreDiameter",
  keyw: "keyWidth",
  slotw: "slotWidth",
  lockradius: "lockRadius",
} as const

export function parseGenevaWheelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "genevawheel" || tokens[0]?.toLowerCase() !== "genevawheel") {
    throw new Error("Expected genevawheel without an inline value")
  }
  const props: Record<string, unknown> = { fn: "genevawheel" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for genevawheel`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "keyway") {
      property = "keyway"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "slots") {
        property = "slots"
        parsed = parseGearInteger(tokenArg, "slots")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown genevawheel token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate genevawheel property "${property}"`)
    }
    props[property] = parsed
  }
  return genevaWheelModelDefinitionSchema.parse(props)
}
