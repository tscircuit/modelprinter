import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { workStopModelDefinitionSchema } from "./schema"

const lengths = {
  basel: "baseLength",
  basew: "baseWidth",
  baset: "baseThickness",
  arm: "armLength",
  armd: "armDiameter",
  tip: "tipDiameter",
  tiplen: "tipLength",
  hole: "holeDiameter",
  pitch: "holePitch",
} as const

export function parseWorkStopModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "workstop" || tokens[0]?.toLowerCase() !== "workstop") {
    throw new Error("Expected workstop without an inline value")
  }
  const props: Record<string, unknown> = { fn: "workstop" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for workstop`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "mountholes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "mountHoles")) {
        throw new Error("Duplicate workstop mountholes")
      }
      props.mountHoles = parseGearInteger(tokenArg, "mountholes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate workstop property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown workstop token "${token}"`)
    }
  }
  return workStopModelDefinitionSchema.parse(props)
}
