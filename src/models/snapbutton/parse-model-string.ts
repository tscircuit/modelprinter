import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { snapButtonModelDefinitionSchema } from "./schema"

const lengths = {
  buttond: "buttonDiameter",
  buttonh: "buttonHeight",
  springw: "springWidth",
  springth: "springThickness",
  legl: "legLength",
  tubeid: "tubeInnerDiameter",
} as const

export function parseSnapButtonModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "snapbutton" || tokens[0]?.toLowerCase() !== "snapbutton") {
    throw new Error("Expected snapbutton without an inline value")
  }
  const props: Record<string, unknown> = { fn: "snapbutton" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for snapbutton`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "angle") {
      if (!tokenArg) throw new Error(`Missing angle value in "${token}"`)
      if (Object.hasOwn(props, "legAngle")) {
        throw new Error("Duplicate snapbutton angle")
      }
      props.legAngle = parseGearAngle(tokenArg, "angle")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate snapbutton property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown snapbutton token "${token}"`)
    }
  }
  return snapButtonModelDefinitionSchema.parse(props)
}
