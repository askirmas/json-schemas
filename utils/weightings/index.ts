import { R,S } from "../../definitions"

export {
  weighting
}

function weighting(list: S, ancestors: R, descentands: R) {
  const weights: S[] = [new Set()]
  , stack: S = new Set(list)
  , done: S = new Set()

  for (const term in descentands)
    if (list.has(term))
      if (!(term in ancestors)) {
        weights[0].add(term)
        done.add(term)
        stack.delete(term)
      }

  weighting: while (stack.size > 0) {
    const next: S = new Set()
    for (const term of stack) {
      if (
        [...ancestors[term]].every(ancestor =>
          !(list.has(ancestor))
          || done.has(ancestor)
        )
      ) {
        next.add(term)
        stack.delete(term)
      }
    }

    if (next.size === 0) {
      weights.push(stack)
      break weighting;
    }
    weights.push(next)
    next.forEach(t => done.add(t))
  }
  return weights
}