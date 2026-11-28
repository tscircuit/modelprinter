import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { snapBoxModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  wall: "wallThickness",
  wallt: "wallThickness",
  corner: "cornerRadius",
  cornerr: "cornerRadius",
  lidt: "lidThickness",
  lidthickness: "lidThickness",
  hookw: "hookWidth",
  hookwidth: "hookWidth",
  hookd: "hookDepth",
  hookdepth: "hookDepth",
  lap: "recessLap",
  recesslap: "recessLap",
} as const

export function parseSnapBoxModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "snapbox" || tokens[0]?.toLowerCase() !== "snapbox") {
    throw new Error("Expected snapbox without an inline value")
  }
  const props: Record<string, unknown> = { fn: "snapbox" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for snapbox`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "snaplid") {
      property = "snapLid"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "hooks") {
        if (tokenArg !== "4") {
          throw new Error(`Expected hooks4 for snapbox, got "${token}"`)
        }
        property = "hooks"
        parsed = 4
      } else {
        throw new Error(`Unknown snapbox token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate snapbox property "${property}"`)
    }
    props[property] = parsed
  }
  return snapBoxModelDefinitionSchema.parse(props)
}
