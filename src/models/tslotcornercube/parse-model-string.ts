import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotCornerCubeModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  h: "height",
  d: "depth",
  holed: "holeDiameter",
  counterbore: "counterboreDiameter",
  counterbored: "counterboreDepth",
} as const

export function parseTSlotCornerCubeModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "tslotcornercube" ||
    tokens[0]?.toLowerCase() !== "tslotcornercube"
  ) {
    throw new Error("Expected tslotcornercube without an inline value")
  }
  const props: Record<string, unknown> = { fn: "tslotcornercube" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for tslotcornercube`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "xyzaxes") {
      if (Object.hasOwn(props, "xyzAxes")) {
        throw new Error("Duplicate tslotcornercube xyzaxes flag")
      }
      props.xyzAxes = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate tslotcornercube property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown tslotcornercube token "${token}"`)
    }
  }
  return tSlotCornerCubeModelDefinitionSchema.parse(props)
}
