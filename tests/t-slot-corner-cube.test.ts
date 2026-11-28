import { expect, test } from "bun:test"
import {
  getTSlotCornerCubeDimensions,
  modelDefinitionSchema,
  parseModelString,
  tSlotCornerCubeModelPropsSchema,
} from "../src"

test("tslotcornercube resolves 20x20x20mm 3-axis counterbored corner cube", () => {
  const parsed = parseModelString(
    "tslotcornercube_w20mm_h20mm_d20mm_holed5mm_counterbore9mm_counterbored3mm_xyzaxes",
  )
  expect(parsed).toEqual({
    fn: "tslotcornercube",
    width: 20,
    height: 20,
    depth: 20,
    holeDiameter: 5,
    counterboreDiameter: 9,
    counterboreDepth: 3,
    xyzAxes: true,
  })
  expect(getTSlotCornerCubeDimensions().minWallMargin).toBe(5.5)
})

test("tslotcornercube supports 30-series cube and schema roundtrip", () => {
  const parsed = parseModelString(
    "tslotcornercube_w30mm_h30mm_d30mm_holed6mm_counterbore11mm",
  )
  expect(parsed.fn).toBe("tslotcornercube")
  if (parsed.fn !== "tslotcornercube") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(tSlotCornerCubeModelPropsSchema.parse({}).width).toBe(20)
})

test("tslotcornercube rejects legacy selectors and oversized counterbores", () => {
  expect(() => parseModelString("tslotcornercube_axes(xyz)")).toThrow()
  expect(() =>
    parseModelString("tslotcornercube_w20mm_counterbore18mm"),
  ).toThrow()
})
