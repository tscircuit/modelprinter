import {
  type HookBoltModelPropsInput,
  hookBoltModelPropsSchema,
} from "./schema"

export function getHookBoltDimensions(input: HookBoltModelPropsInput = {}) {
  const p = hookBoltModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const hookCenterlineRadius = (p.hookInnerDiameter + p.hookWireDiameter) / 2
  const hookOuterSpan = p.hookInnerDiameter + 2 * p.hookWireDiameter
  return {
    ...p,
    majorDiameter,
    hookCenterlineRadius,
    hookOuterSpan,
    bottomZ: -p.straightLength,
    topZ: p.hookInnerDiameter / 2 + p.hookWireDiameter,
  }
}
