import { parseModelStringParams } from "../../parse-model-string"
import { parseHexSocketBoltModelParams } from "../../parse-hex-socket-bolt-model-string"

export const isHexSocketBoltShorthand = (value: string) =>
  /^(?:m\d+(?:\.\d+)?bolt|bolt)(?:_|$)/i.test(value.trim())

/** Socket-head shorthand defaults to M3 x 10 mm. Explicit length tokens use
 * the existing hexsocketbolt grammar; full hexsocketbolt strings are unchanged.
 */
export function normalizeHexSocketBoltModelString(value: string): string {
  if (!isHexSocketBoltShorthand(value)) return value
  const [root, ...tokens] = value.trim().split("_")
  const metric = root!.match(/^m(\d+(?:\.\d+)?)bolt$/i)?.[1]
  if (metric) tokens.unshift(`m${metric}`)
  else if (!tokens.some((token) => /^m[\d.]/i.test(token))) tokens.unshift("m3")
  if (!tokens.some((token) => /^(?:l|length)(?:[^a-z]|$)/i.test(token)))
    tokens.push("l10mm")
  const props = parseHexSocketBoltModelParams(
    parseModelStringParams(`hexsocketbolt_${tokens.join("_")}`),
  )
  return `hexsocketbolt_${props.metricSize.toLowerCase()}_l${props.length}mm${props.showThreads ? "" : "_nothreads"}`
}
