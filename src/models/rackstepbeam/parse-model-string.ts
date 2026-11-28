import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { rackStepBeamModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  h: "height",
  w: "width",
  wall: "wallThickness",
  stepw: "stepWidth",
  stepd: "stepDepth",
  r: "cornerRadius",
  hole: "holeDiameter",
  pitch: "holePitch",
} as const

export function parseRackStepBeamModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "rackstepbeam" ||
    tokens[0]?.toLowerCase() !== "rackstepbeam"
  ) {
    throw new Error("Expected rackstepbeam without an inline value")
  }
  const props: Record<string, unknown> = { fn: "rackstepbeam" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for rackstepbeam`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "endholes") {
      if (!tokenArg) throw new Error(`Missing endhole count in "${token}"`)
      if (Object.hasOwn(props, "endHoles")) {
        throw new Error("Duplicate rackstepbeam endholes")
      }
      props.endHoles = parseGearInteger(tokenArg, "endholes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate rackstepbeam property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown rackstepbeam token "${token}"`)
    }
  }
  return rackStepBeamModelDefinitionSchema.parse(props)
}
