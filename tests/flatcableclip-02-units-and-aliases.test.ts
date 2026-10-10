import { test, expect } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  flatCableClipModelPropsSchema,
  flatCableClipModelDefinitionSchema,
  getFlatCableClipDimensions,
} from "../src"
import { props, modelString } from "./fixtures/flatcableclip-case"
test("flatcableclip converts units and accepts full aliases without losing duplicate validation", () => {
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
    iw: "innerWidth",
    innerwidth: "innerWidth",
    ih: "innerHeight",
    innerheight: "innerHeight",
    d: "depth",
    depth: "depth",
    t: "thickness",
    thickness: "thickness",
    feet: "footLength",
    footlength: "footLength",
    holes: "holeCount",
    hole: "holeDiameter",
    holediameter: "holeDiameter",
    hp: "holePitch",
    holepitch: "holePitch",
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
