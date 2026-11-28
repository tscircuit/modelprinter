import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pushbuttonModelDefinitionSchema } from "./schema"

const lengths = {
  cutout: "cutoutDiameter",
  cutoutd: "cutoutDiameter",
  bodyod: "bodyOuterDiameter",
  bodyouterdiameter: "bodyOuterDiameter",
  l: "rearLength",
  length: "rearLength",
  rearl: "rearLength",
  headod: "headOuterDiameter",
  headouterdiameter: "headOuterDiameter",
  headh: "headHeight",
  headheight: "headHeight",
} as const

export function parsePushbuttonModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "pushbutton" || tokens[0]?.toLowerCase() !== "pushbutton") {
    throw new Error("Expected pushbutton without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pushbutton" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pushbutton`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "roundmomentary") {
      property = "roundMomentary"
      parsed = true
    } else if (lower === "threadnut") {
      property = "threadNut"
      parsed = true
    } else if (lower === "rearblock") {
      property = "rearBlock"
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
        throw new Error(`Unknown pushbutton token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate pushbutton property "${property}"`)
    }
    props[property] = parsed
  }
  return pushbuttonModelDefinitionSchema.parse(props)
}
