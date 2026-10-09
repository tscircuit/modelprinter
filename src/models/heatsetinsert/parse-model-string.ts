import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { heatSetInsertModelDefinitionSchema } from "./schema"
const aliases: Record<string, string> = {
  m: "metricSize",
  metricsize: "metricSize",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  l: "length",
  length: "length",
  knurldepth: "knurlDepth",
  knurlp: "knurlPitch",
  knurlpitch: "knurlPitch",
  knurlteeth: "knurlTeeth",
  diameter: "diameter",
  threadpitch: "threadPitch",
  threadminordiameter: "threadMinorDiameter",
  threadpitchdiameter: "threadPitchDiameter",
  rootouterdiameter: "rootOuterDiameter",
}
const flags: Record<string, string> = {
  diamondknurl: "diamondKnurl",
  lefthanded: "leftHand",
  righthanded: "leftHand",
  threads: "showThreads",
  nothreads: "showThreads",
}
export function parseHeatSetInsertModelParams(raw: RawModelprinterParams) {
  if (raw.fn !== "heatsetinsert")
    throw new Error("Expected heatsetinsert params")
  const [root, ...tokens] = splitModelStringTokens(raw.string)
  if (root?.toLowerCase() !== "heatsetinsert")
    throw new Error("heatsetinsert does not accept an inline value")
  const props: Record<string, unknown> = {}
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i),
      key = match?.[1]?.toLowerCase() ?? "",
      value = match?.[2] ?? ""
    let property: string, parsed: unknown
    if (flags[key]) {
      if (value) throw new Error("Flags do not accept values")
      property = flags[key]!
      parsed = !["righthanded", "nothreads"].includes(key)
    } else {
      property = aliases[key] ?? ""
      if (!property || !value)
        throw new Error(`Unknown or missing heatsetinsert token ${token}`)
      if (property === "metricSize") {
        const size =
          key === "m" ? value : value.match(/^\((m\d+)\)$/i)?.[1]?.slice(1)
        if (!size || !/^\d+$/.test(size)) throw new Error("Invalid metric size")
        parsed = `M${size}`
      } else if (property === "knurlTeeth") {
        if (!/^\d+$/.test(value))
          throw new Error("knurlteeth requires a unitless integer")
        parsed = Number(value)
      } else {
        if (!/^(?:\d+(?:\.\d+)?|\.\d+)(?:mm|cm|m|in|inch)?$/i.test(value))
          throw new Error(`Invalid length ${token}`)
        parsed = value
      }
    }
    if (property in props)
      throw new Error(`Property ${property} is set more than once`)
    props[property] = parsed
  }
  return heatSetInsertModelDefinitionSchema.parse({
    fn: "heatsetinsert",
    ...props,
  })
}
