import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotTeePlateModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  h: "height",
  armw: "armWidth",
  t: "thickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
  p: "holePitch",
} as const

export function parseTSlotTeePlateModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "tslotteeplate" ||
    tokens[0]?.toLowerCase() !== "tslotteeplate"
  ) {
    throw new Error("Expected tslotteeplate without an inline value")
  }
  const props: Record<string, unknown> = { fn: "tslotteeplate" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for tslotteeplate`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "tee") {
      if (Object.hasOwn(props, "teeShape")) {
        throw new Error("Duplicate tslotteeplate tee flag")
      }
      props.teeShape = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing hole count in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate tslotteeplate holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate tslotteeplate property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown tslotteeplate token "${token}"`)
    }
  }
  return tSlotTeePlateModelDefinitionSchema.parse(props)
}
