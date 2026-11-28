import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { boltOnLiftingLugModelDefinitionSchema } from "./schema"

const lengths = {
  basew: "baseWidth",
  based: "baseDepth",
  baset: "baseThickness",
  h: "height",
  lugw: "lugWidth",
  lugt: "lugThickness",
  eye: "eyeDiameter",
  eyez: "eyeZ",
  topr: "topRadius",
  hole: "holeDiameter",
  pitchx: "pitchX",
  pitchy: "pitchY",
  gussett: "gussetThickness",
  gusseth: "gussetHeight",
} as const

export function parseBoltOnLiftingLugModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "boltonliftinglug" ||
    tokens[0]?.toLowerCase() !== "boltonliftinglug"
  ) {
    throw new Error("Expected boltonliftinglug without an inline value")
  }
  const props: Record<string, unknown> = { fn: "boltonliftinglug" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for boltonliftinglug`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "mounts") {
      if (!tokenArg) throw new Error(`Missing mount count in "${token}"`)
      if (Object.hasOwn(props, "mounts")) {
        throw new Error("Duplicate boltonliftinglug mounts")
      }
      props.mounts = parseGearInteger(tokenArg, "mounts")
    } else if (tokenName === "gussets") {
      if (!tokenArg) throw new Error(`Missing gusset count in "${token}"`)
      if (Object.hasOwn(props, "gussets")) {
        throw new Error("Duplicate boltonliftinglug gussets")
      }
      props.gussets = parseGearInteger(tokenArg, "gussets")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate boltonliftinglug property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown boltonliftinglug token "${token}"`)
    }
  }
  return boltOnLiftingLugModelDefinitionSchema.parse(props)
}
