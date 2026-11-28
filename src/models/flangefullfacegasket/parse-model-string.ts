import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flangeFullFaceGasketModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  t: "thickness",
  thickness: "thickness",
  boltcirc: "boltCircleDiameter",
  pcd: "boltCircleDiameter",
  holed: "holeDiameter",
  hole: "holeDiameter",
} as const

export function parseFlangeFullFaceGasketModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "flangefullfacegasket" ||
    tokens[0]?.toLowerCase() !== "flangefullfacegasket"
  ) {
    throw new Error("Expected flangefullfacegasket without an inline value")
  }
  const props: Record<string, unknown> = { fn: "flangefullfacegasket" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for flangefullfacegasket`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "flat") {
      property = "flat"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "holes") {
        property = "holes"
        parsed = parseGearInteger(tokenArg, "holes")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown flangefullfacegasket token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate flangefullfacegasket property "${property}"`)
    }
    props[property] = parsed
  }
  return flangeFullFaceGasketModelDefinitionSchema.parse(props)
}
