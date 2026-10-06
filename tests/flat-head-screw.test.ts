import { test } from "bun:test"
import { assertFlatHeadScrew } from "./fixtures/assert-flat-head-screw"

test("flatheadscrew parameter contract", assertFlatHeadScrew)
