import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { viseJawModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  h: "height",
  height: "height",
  t: "thickness",
  thickness: "thickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
  pitch: "pitch",
  p: "pitch",
  holez: "holeZ",
  steph: "stepHeight",
  stepd: "stepDepth",
} as const

export function parseViseJawModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "visejaw" || tokens[0]?.toLowerCase() !== "visejaw") {
    throw new Error("Expected visejaw without an inline value")
  }
  const props: Record<string, unknown> = { fn: "visejaw" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for visejaw`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
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
      throw new Error(`Unknown visejaw token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate visejaw property "${property}"`)
    }
    props[property] = parsed
  }
  return viseJawModelDefinitionSchema.parse(props)
}
