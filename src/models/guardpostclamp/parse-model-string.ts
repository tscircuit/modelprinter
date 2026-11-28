import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { guardPostClampModelDefinitionSchema } from "./schema"

const lengths = {
  insidew: "insideWidth",
  insided: "insideDepth",
  h: "height",
  wall: "wallThickness",
  earw: "earWidth",
  eart: "earThickness",
  hole: "holeDiameter",
  earpitch: "earPitch",
} as const

export function parseGuardPostClampModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "guardpostclamp" ||
    tokens[0]?.toLowerCase() !== "guardpostclamp"
  ) {
    throw new Error("Expected guardpostclamp without an inline value")
  }
  const props: Record<string, unknown> = { fn: "guardpostclamp" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for guardpostclamp`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "earholes") {
      if (!tokenArg) throw new Error(`Missing earhole count in "${token}"`)
      if (Object.hasOwn(props, "earHoles")) {
        throw new Error("Duplicate guardpostclamp earholes")
      }
      props.earHoles = parseGearInteger(tokenArg, "earholes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate guardpostclamp property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown guardpostclamp token "${token}"`)
    }
  }
  return guardPostClampModelDefinitionSchema.parse(props)
}
