import { expect, test } from "bun:test"
import { z } from "zod"
import {
  defineModel,
  ModelRegistry,
  getRectangularTubeDrawing,
  type ModelDrawing,
} from "../src"
import { parseModelStringParams } from "../src/parse-model-string"

test("drawing hooks receive validated model definitions and remain isolated per registry", () => {
  const schema = z.object({
    fn: z.literal("stock"),
    length: z.number().default(80),
  })
  let parses = 0
  let callbacks = 0
  const descriptor = defineModel({
    name: "stock",
    schema,
    parse: () => {
      parses++
      return schema.parse({ fn: "stock" })
    },
    getDrawing: (definition) => {
      callbacks++
      expect(definition).toEqual({ fn: "stock", length: 80 })
      return getRectangularTubeDrawing({
        width: 40,
        height: 20,
        wallThickness: 3,
        length: definition.length,
      })
    },
  })
  const first = new ModelRegistry()
  first.register(descriptor)
  const second = new ModelRegistry()
  second.register({ name: "stock", schema, parse: descriptor.parse })
  const mutable = descriptor as {
    getDrawing?: (definition: z.output<typeof schema>) => ModelDrawing
  }
  mutable.getDrawing = () => {
    throw new Error("replaced")
  }
  const raw = parseModelStringParams("stock")
  expect(first.drawing(raw)!.namedEdges[2]!.end.z).toBe(80)
  expect(parses).toBe(1)
  expect(callbacks).toBe(1)
  expect(second.drawing(raw)).toBeUndefined()
  expect(() => first.drawing(parseModelStringParams("unknown"))).toThrow(
    "Unsupported modelprinter function",
  )
  const invalid = new ModelRegistry()
  expect(() =>
    invalid.register({
      name: "stock",
      schema,
      parse: descriptor.parse,
      getDrawing: 1 as unknown as typeof descriptor.getDrawing,
    }),
  ).toThrow("drawing callback must be a function")
  invalid.register({
    name: "stock",
    schema,
    parse: descriptor.parse,
    getDrawing: () => ({ namedEdges: [], views: [] }),
  })
  expect(() => invalid.drawing(raw)).toThrow()
})
