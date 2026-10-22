import { expect, test } from "bun:test"
import { getRectangularTubeDrawing, mp } from "../src"

test("stock-tube drawing declares actual edges and infers overall measurements from views", () => {
  const model = mp.string("rectangulartube_w40mm_h20mm_wall3mm_l80mm")
  const definition = model.json()
  const original = structuredClone(definition)
  const drawing = model.drawing()!
  expect(drawing.namedEdges).toEqual([
    {
      name: "outer_top",
      start: { x: -20, y: 10, z: 0 },
      end: { x: 20, y: 10, z: 0 },
    },
    {
      name: "outer_left",
      start: { x: -20, y: -10, z: 0 },
      end: { x: -20, y: 10, z: 0 },
    },
    {
      name: "outer_right_longitudinal",
      start: { x: 20, y: -10, z: 0 },
      end: { x: 20, y: -10, z: 80 },
    },
  ])
  expect(
    drawing.views.map(({ name, direction }) => ({ name, direction })),
  ).toEqual([
    { name: "end", direction: "z+" },
    { name: "side", direction: "y-" },
  ])
  expect(drawing.views[0]!.dimensions).toEqual([
    { widthOfView: true, orientation: "horizontal", offset: 10, precision: 1 },
    { heightOfView: true, orientation: "vertical", offset: 10, precision: 1 },
  ])
  expect(drawing.views[1]!.dimensions).toEqual([
    { heightOfView: true, orientation: "vertical", offset: -10, precision: 1 },
  ])
  expect(
    getRectangularTubeDrawing({
      width: "4cm",
      height: "2cm",
      wallThickness: "0.3cm",
      length: "8cm",
    }),
  ).toEqual(drawing)
  expect(model.json()).toEqual(original)
  expect(definition).toEqual(original)
  const larger = getRectangularTubeDrawing({
    width: 60,
    height: 30,
    wallThickness: 4,
    length: 120,
    outerRadius: 5,
    innerRadius: 1,
  })
  expect(larger.namedEdges.map((edge) => edge.name)).toEqual(
    drawing.namedEdges.map((edge) => edge.name),
  )
  expect(
    larger.namedEdges.map(({ start, end }) =>
      Math.hypot(end.x - start.x, end.y - start.y, end.z - start.z),
    ),
  ).toEqual([50, 20, 120])
  const rounded = mp
    .string("rectangulartube_w40mm_h20mm_wall3mm_l80mm_outerr4mm_innerr1mm")
    .drawing()!
  expect(rounded.namedEdges).toEqual([
    {
      name: "outer_top",
      start: { x: -16, y: 10, z: 0 },
      end: { x: 16, y: 10, z: 0 },
    },
    {
      name: "outer_left",
      start: { x: -20, y: -6, z: 0 },
      end: { x: -20, y: 6, z: 0 },
    },
    {
      name: "outer_right_longitudinal",
      start: { x: 20, y: -6, z: 0 },
      end: { x: 20, y: -6, z: 80 },
    },
  ])
  // Bounds dimensions remain view presets, not imaginary model edges.
  expect(rounded.views).toEqual(drawing.views)
  expect(drawing.namedEdges.some(({ name }) => name === "wall_thickness")).toBe(
    false,
  )
  expect(() =>
    getRectangularTubeDrawing({
      width: 40,
      height: 20,
      wallThickness: 10,
      length: 80,
    }),
  ).toThrow()
  expect(mp.string("ballbearing625zz").drawing()).toBeUndefined()
})
