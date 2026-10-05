import { pcbCardGuideModelDefinitionSchema } from "./pcb-card-guide-schema"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"

const lengths: Record<string, string> = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  slotw: "slotWidth",
  slotwidth: "slotWidth",
  slotd: "slotDepth",
  slotdepth: "slotDepth",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
  endweb: "endWeb",
  mountedgemargin: "mountEdgeMargin",
}

export function parsePcbCardGuideModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "pcbcardguide" || tokens[0]?.toLowerCase() !== "pcbcardguide")
    throw new Error("Expected pcbcardguide without an inline value")
  const props: Record<string, unknown> = { fn: "pcbcardguide" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid PCB guide token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown = value
    if (Object.hasOwn(lengths, name)) {
      property = lengths[name]!
      if (!/^[+\-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|mil)?$/i.test(value))
        throw new Error(`Invalid PCB guide length "${token}"`)
    } else if (name === "mounts" || name === "mountcount") {
      property = "mountCount"
      if (!/^\d+$/.test(value))
        throw new Error("Mount count must be an integer")
      parsed = Number(value)
    } else if (name === "spec") {
      property = "spec"
      if (!/^\(customv1\)$/i.test(value))
        throw new Error("PCB guide spec must be customv1")
      parsed = "customv1"
    } else throw new Error(`Unknown PCB guide token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate PCB guide property "${property}"`)
    props[property] = parsed
  }
  return pcbCardGuideModelDefinitionSchema.parse(props)
}
