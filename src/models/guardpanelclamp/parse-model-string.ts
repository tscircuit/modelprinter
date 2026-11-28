import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { guardPanelClampModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  h: "height",
  partt: "partThickness",
  groovew: "grooveWidth",
  grooved: "grooveDepth",
  hole: "holeDiameter",
  pitch: "holePitch",
} as const

export function parseGuardPanelClampModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "guardpanelclamp" ||
    tokens[0]?.toLowerCase() !== "guardpanelclamp"
  ) {
    throw new Error("Expected guardpanelclamp without an inline value")
  }
  const props: Record<string, unknown> = { fn: "guardpanelclamp" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for guardpanelclamp`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "widthgroove") {
      if (Object.hasOwn(props, "widthGroove")) {
        throw new Error("Duplicate guardpanelclamp widthgroove flag")
      }
      props.widthGroove = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "parts") {
      if (!tokenArg) throw new Error(`Missing part count in "${token}"`)
      if (Object.hasOwn(props, "parts")) {
        throw new Error("Duplicate guardpanelclamp parts")
      }
      props.parts = parseGearInteger(tokenArg, "parts")
    } else if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing hole count in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate guardpanelclamp holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate guardpanelclamp property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown guardpanelclamp token "${token}"`)
    }
  }
  return guardPanelClampModelDefinitionSchema.parse(props)
}
