import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { bladeFuseModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  bodyh: "bodyHeight",
  t: "thickness",
  thickness: "thickness",
  bladel: "bladeLength",
  bladew: "bladeWidth",
  bladet: "bladeThickness",
  p: "pitch",
  pitch: "pitch",
} as const

export function parseBladeFuseModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "bladefuse" || tokens[0]?.toLowerCase() !== "bladefuse") {
    throw new Error("Expected bladefuse without an inline value")
  }
  const props: Record<string, unknown> = { fn: "bladefuse" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for bladefuse`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "regularflatblade") {
      property = "regularFlatBlade"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "blades") {
        property = "blades"
        parsed = parseGearInteger(tokenArg, "blades")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown bladefuse token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate bladefuse property "${property}"`)
    }
    props[property] = parsed
  }
  return bladeFuseModelDefinitionSchema.parse(props)
}
