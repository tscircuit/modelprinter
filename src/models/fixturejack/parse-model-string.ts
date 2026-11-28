import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseFixtureJackMetricThread } from "./normalize"
import { fixtureJackModelDefinitionSchema } from "./schema"

const lengths = {
  based: "baseDiameter",
  baseh: "baseHeight",
  h: "height",
  travel: "travel",
  stem: "stemDiameter",
  threadl: "threadLength",
  padd: "padDiameter",
  padt: "padThickness",
} as const

export function parseFixtureJackModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "fixturejack" || tokens[0]?.toLowerCase() !== "fixturejack") {
    throw new Error("Expected fixturejack without an inline value")
  }
  const props: Record<string, unknown> = { fn: "fixturejack" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for fixturejack`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate fixturejack thread size")
      }
      props.threadDiameter = parseFixtureJackMetricThread(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate fixturejack property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown fixturejack token "${token}"`)
    }
  }
  return fixtureJackModelDefinitionSchema.parse(props)
}
