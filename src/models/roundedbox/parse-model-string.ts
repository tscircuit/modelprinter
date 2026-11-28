import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { roundedBoxModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  wall: "wallThickness",
  wallthickness: "wallThickness",
  corner: "cornerRadius",
  cornerradius: "cornerRadius",
  lidt: "lidThickness",
  lidthickness: "lidThickness",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  hpx: "holePitchX",
  holepitchx: "holePitchX",
  hpy: "holePitchY",
  holepitchy: "holePitchY",
  boss: "bossDiameter",
  bossdiameter: "bossDiameter",
} as const

export function parseRoundedBoxModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "roundedbox" || !/^roundedbox$/i.test(tokens[0] ?? "")) {
    throw new Error("Expected roundedbox without an inline value")
  }

  const props: Record<string, unknown> = { fn: "roundedbox" }
  const seen = new Set<string>()

  const setProp = (property: string, value: unknown) => {
    if (seen.has(property)) {
      throw new Error(`Duplicate roundedbox property "${property}"`)
    }
    seen.add(property)
    props[property] = value
  }

  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase()
    const value = match?.[2] ?? ""
    if (!name) {
      throw new Error(`Invalid roundedbox token "${token}"`)
    }

    if (name === "screwon" || name === "screwonlid") {
      if (value !== "") throw new Error(`${name} is a value-free flag`)
      setProp("screwOnLid", true)
    } else if (name === "screws" || name === "screwcount") {
      if (!/^\d+$/.test(value)) {
        throw new Error("Roundedbox screwCount must be an integer")
      }
      setProp("screwCount", Number(value))
    } else if (name === "hp" || name === "holepitch") {
      const tuple = value.match(/^\(([^(),]+),([^(),]+)\)$/)
      if (!tuple) {
        throw new Error(`${name} requires two parenthesized lengths`)
      }
      setProp("holePitchX", tuple[1]!.trim())
      setProp("holePitchY", tuple[2]!.trim())
    } else if (Object.hasOwn(lengths, name)) {
      setProp(lengths[name as keyof typeof lengths], value)
    } else {
      throw new Error(`Unknown roundedbox token "${token}"`)
    }
  }

  return roundedBoxModelDefinitionSchema.parse(props)
}
