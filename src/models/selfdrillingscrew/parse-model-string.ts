import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { selfDrillingScrewModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  core: "coreDiameter",
  threadpitch: "threadPitch",
  l: "length",
  length: "length",
  threadl: "threadLength",
  af: "acrossFlats",
  headh: "headHeight",
  flangeod: "flangeOuterDiameter",
  drilll: "drillLength",
} as const

export function parseSelfDrillingScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "selfdrillingscrew" ||
    tokens[0]?.toLowerCase() !== "selfdrillingscrew"
  ) {
    throw new Error("Expected selfdrillingscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "selfdrillingscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for selfdrillingscrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "righthanded") {
      property = "rightHanded"
      parsed = true
    } else if (lower === "lefthanded") {
      property = "rightHanded"
      parsed = false
    } else if (lower === "hexflange") {
      property = "hexFlange"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "flutes") {
        property = "flutes"
        parsed = parseGearInteger(tokenArg, "flutes")
      } else if (tokenName === "pointangle") {
        property = "pointAngle"
        parsed = parseGearAngle(tokenArg, "pointangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown selfdrillingscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate selfdrillingscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return selfDrillingScrewModelDefinitionSchema.parse(props)
}
