import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  modelprinter,
  nemaMotorMountDimensions,
  nemaMotorMountModelDefinitionSchema,
  nemaMotorMountModelPropsSchema,
} from "../src"

test("nemamotormount resolves both common interfaces and the complete bracket string", () => {
  const example =
    "nemamotormount_nema17_w50mm_h60mm_depth40mm_t3mm_axisheight30mm_shaft23mm_motorhole3.5mm_basehole5.5mm_basexspan30mm_baseoffset20mm"
  const definition = mp.string(example).json()
  if (definition.fn !== "nemamotormount") throw new Error("Wrong family")
  expect(definition).toEqual({
    fn: "nemamotormount",
    nemaSize: 17,
    ...nemaMotorMountDimensions[17],
  })
  expect(modelDefinitionSchema.parse(definition)).toEqual(definition)
  expect(nemaMotorMountModelDefinitionSchema.parse(definition)).toEqual(
    definition,
  )
  expect(modelprinter.getModelNames()).toContain("nemamotormount")
  for (const nemaSize of [17, 23] as const) {
    expect(nemaMotorMountModelPropsSchema.parse({ nemaSize })).toEqual({
      nemaSize,
      ...nemaMotorMountDimensions[nemaSize],
    })
    expect(mp.string(`nemamotormount_nema${nemaSize}`).json()).toEqual({
      fn: "nemamotormount",
      nemaSize,
      ...nemaMotorMountDimensions[nemaSize],
    })
  }
})
