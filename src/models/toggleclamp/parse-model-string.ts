import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { toggleClampModelDefinitionSchema } from "./schema"

const lengths = {
  basew: "baseWidth",
  basel: "baseLength",
  baseh: "baseThickness",
  hole: "holeDiameter",
  px: "pitchX",
  py: "pitchY",
  arml: "armLength",
  armw: "armWidth",
  armh: "armHeight",
  pivoth: "pivotHeight",
  handlel: "handleLength",
  padod: "padOuterDiameter",
} as const

export function parseToggleClampModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "toggleclamp" || tokens[0]?.toLowerCase() !== "toggleclamp") {
    throw new Error("Expected toggleclamp without an inline value")
  }
  const props: Record<string, unknown> = { fn: "toggleclamp" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for toggleclamp`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "vertical") {
      if (Object.hasOwn(props, "vertical")) {
        throw new Error("Duplicate toggleclamp vertical flag")
      }
      props.vertical = true
      continue
    }
    if (lower === "closed") {
      if (Object.hasOwn(props, "closed")) {
        throw new Error("Duplicate toggleclamp closed flag")
      }
      props.closed = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate toggleclamp holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate toggleclamp property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown toggleclamp token "${token}"`)
    }
  }
  return toggleClampModelDefinitionSchema.parse(props)
}
