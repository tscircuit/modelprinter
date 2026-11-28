import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { idlerSprocketModelDefinitionSchema } from "./schema"

const lengths = {
  pitch: "pitch",
  bore: "boreDiameter",
  toothw: "toothWidth",
  rollerd: "rollerDiameter",
  tipod: "tipOuterDiameter",
  rootod: "rootOuterDiameter",
} as const

export function parseIdlerSprocketModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "idlersprocket" ||
    tokens[0]?.toLowerCase() !== "idlersprocket"
  ) {
    throw new Error("Expected idlersprocket without an inline value")
  }
  const props: Record<string, unknown> = { fn: "idlersprocket" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for idlersprocket`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "rollerpocket") {
      if (Object.hasOwn(props, "rollerPocket")) {
        throw new Error("Duplicate idlersprocket rollerpocket flag")
      }
      props.rollerPocket = true
      continue
    }
    if (lower === "bearingbore") {
      if (Object.hasOwn(props, "bearingBore")) {
        throw new Error("Duplicate idlersprocket bearingbore flag")
      }
      props.bearingBore = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "teeth") {
      if (!tokenArg) throw new Error(`Missing tooth count in "${token}"`)
      if (Object.hasOwn(props, "teeth")) {
        throw new Error("Duplicate idlersprocket teeth")
      }
      props.teeth = parseGearInteger(tokenArg, "teeth")
    } else if (tokenName === "strands") {
      if (!tokenArg) throw new Error(`Missing strand count in "${token}"`)
      if (Object.hasOwn(props, "strands")) {
        throw new Error("Duplicate idlersprocket strands")
      }
      props.strands = parseGearInteger(tokenArg, "strands")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate idlersprocket property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown idlersprocket token "${token}"`)
    }
  }
  return idlerSprocketModelDefinitionSchema.parse(props)
}
