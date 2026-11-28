import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { sphericalPlainBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  w: "width",
} as const

export function parseSphericalPlainBearingModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "sphericalplainbearing" ||
    tokens[0]?.toLowerCase() !== "sphericalplainbearing"
  ) {
    throw new Error("Expected sphericalplainbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "sphericalplainbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for sphericalplainbearing`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "radial") {
      if (Object.hasOwn(props, "radial")) {
        throw new Error("Duplicate sphericalplainbearing radial flag")
      }
      props.radial = true
      continue
    }
    if (lower === "open" || lower === "sealed") {
      if (Object.hasOwn(props, "closure")) {
        throw new Error("Duplicate sphericalplainbearing closure flag")
      }
      props.closure = lower
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "misalignment") {
      if (!tokenArg) throw new Error(`Missing angle value in "${token}"`)
      if (Object.hasOwn(props, "misalignmentAngle")) {
        throw new Error("Duplicate sphericalplainbearing misalignment")
      }
      props.misalignmentAngle = parseGearAngle(tokenArg, "misalignment")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(
          `Duplicate sphericalplainbearing property "${property}"`,
        )
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown sphericalplainbearing token "${token}"`)
    }
  }
  return sphericalPlainBearingModelDefinitionSchema.parse(props)
}
