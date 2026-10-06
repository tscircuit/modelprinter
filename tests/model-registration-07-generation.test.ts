import { test } from "bun:test"
import { assertModelRegistryGeneration } from "./fixtures/assert-model-registry-generation"

test(
  "model discovery is deterministic and follows adapter addition and removal",
  assertModelRegistryGeneration,
)
