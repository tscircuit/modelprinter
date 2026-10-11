import { test, expect } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  cableClipModelPropsSchema,
  cableClipModelDefinitionSchema,
  getCableClipDimensions,
} from "../src"
import { props, modelString } from "./fixtures/cableclip-case"
test("cableclip converts units and accepts full aliases without losing duplicate validation", () => {
  const source = modelString.replace(
    /(\d+(?:\.\d+)?)mm/g,
    (_, n) => `${Number(n) / 10}cm`,
  )
  const converted = mp.string(source).json(),
    reference = mp.string(modelString).json()
  for (const [key, value] of Object.entries(reference)) {
    if (typeof value === "number")
      expect(
        (converted as unknown as Record<string, unknown>)[key],
      ).toBeCloseTo(value, 10)
    else
      expect((converted as unknown as Record<string, unknown>)[key]).toEqual(
        value,
      )
  }
  const aliases = {
    cable: "cableDiameter",
    cablediameter: "cableDiameter",
    w: "width",
    width: "width",
    h: "height",
    height: "height",
    t: "thickness",
    thickness: "thickness",
    arc: "arcDegrees",
    tab: "tabLength",
    tablength: "tabLength",
    hole: "holeDiameter",
    holediameter: "holeDiameter",
  }
  const expanded = modelString
    .split("_")
    .map((token, i) => {
      if (!i) return token
      const match = token.match(/^([a-z]+)(.*)$/)!
      const property = aliases[match[1] as keyof typeof aliases]
      const alias = Object.entries(aliases)
        .filter(([, value]) => value === property)
        .sort(([a], [b]) => b.length - a.length)[0]![0]
      return alias + match[2]
    })
    .join("_")
  expect(mp.string(expanded).json()).toEqual(mp.string(modelString).json())
})
