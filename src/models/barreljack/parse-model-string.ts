import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { barrelJackModelDefinitionSchema } from "./schema"

const lengths = {
  plugod: "plugOuterDiameter",
  plugouterdiameter: "plugOuterDiameter",
  pinod: "centerPinDiameter",
  centerpind: "centerPinDiameter",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  l: "length",
  length: "length",
} as const

export function parseBarrelJackModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "barreljack" || tokens[0]?.toLowerCase() !== "barreljack") {
    throw new Error("Expected barreljack without an inline value")
  }
  const props: Record<string, unknown> = { fn: "barreljack" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for barreljack`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "boxjack") {
      property = "boxJack"
      parsed = true
    } else if (lower === "throughhole" || lower === "tht") {
      property = "throughHole"
      parsed = true
    } else if (lower === "horizontal") {
      property = "horizontal"
      parsed = true
    } else if (lower === "frontcenterrear") {
      property = "frontCenterRear"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "contacts") {
        if (tokenArg !== "3") {
          throw new Error(
            `Only 3-contact barrel jacks (contacts3) are supported, got "${token}"`,
          )
        }
        property = "contacts"
        parsed = 3
      } else {
        throw new Error(`Unknown barreljack token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate barreljack property "${property}"`)
    }
    props[property] = parsed
  }
  return barrelJackModelDefinitionSchema.parse(props)
}
