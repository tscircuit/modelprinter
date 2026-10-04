import { test } from "bun:test"
import { assertBallBearings } from "./fixtures/assert-bearings"

test("radial and thrust ball bearing parameter contracts", assertBallBearings)
