import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { thrustBallBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  h: "height",
  height: "height",
} as const

export function parseThrustBallBearingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  const head = tokens[0]?.toLowerCase() ?? ""
  if (raw.fn !== "thrustballbearing" || !head.startsWith("thrustballbearing")) {
    throw new Error("Expected thrustballbearing model prefix")
  }
  const props: Record<string, unknown> = { fn: "thrustballbearing" }
  const inlineCode = head.slice("thrustballbearing".length)
  if (inlineCode) {
    if (!/^\d+$/.test(inlineCode)) {
      throw new Error(
        `Unsupported thrustballbearing inline designation "${head}"`,
      )
    }
    props.code = inlineCode
  }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for thrustballbearing`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "flatwasherpair") {
      property = "flatWasherPair"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "code" || tokenName === "series") {
        if (!/^\d+$/.test(tokenArg)) {
          throw new Error(
            `Bearing series code requires digits in token "${token}"`,
          )
        }
        property = "code"
        parsed = tokenArg
      } else if (tokenName === "rows") {
        if (tokenArg !== "1") {
          throw new Error(
            `Only single-row thrust ball bearings (rows1) are supported, got "${token}"`,
          )
        }
        property = "rows"
        parsed = 1
      } else {
        throw new Error(`Unknown thrustballbearing token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate thrustballbearing property "${property}"`)
    }
    props[property] = parsed
  }
  return thrustBallBearingModelDefinitionSchema.parse(props)
}
