import { weighting } from "./index"

describe(weighting.name, () => {
  it('1', () => {
    const words = new Set(["A", "B", "C"])
    , descendants = {
      "A": new Set(["B", "C"]),
      "B": new Set(["C"])
    }
    , ancestors = {
      "C": new Set(["A", "B"]),
      "B": new Set(["A"])
    }

    return expect(
      weighting(words, descendants, ancestors)
      .reverse()
    ).toStrictEqual(
      weighting(words, ancestors, descendants)
    )
  })
})