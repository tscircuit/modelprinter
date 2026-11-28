import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tensionerPulleyModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  w: "width",
  arml: "armLength",
  pivotd: "pivotDiameter",
  bearingbore: "bearingBore",
  springhole: "springHoleDiameter",
} as const

export function parseTensionerPulleyModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "tensionerpulley" ||
    tokens[0]?.toLowerCase() !== "tensionerpulley"
  ) {
    throw new Error("Expected tensionerpulley without an inline value")
  }
  const props: Record<string, unknown> = { fn: "tensionerpulley" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for tensionerpulley`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "pivotbore") {
      if (Object.hasOwn(props, "pivotBore")) {
        throw new Error("Duplicate tensionerpulley pivotbore flag")
      }
      props.pivotBore = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate tensionerpulley property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown tensionerpulley token "${token}"`)
    }
  }
  return tensionerPulleyModelDefinitionSchema.parse(props)
}
