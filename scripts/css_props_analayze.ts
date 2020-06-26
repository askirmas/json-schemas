import {props_units as properties} from "../build/css/terms.json"
import { R, S } from "../definitions"
import { weighting } from "../utils/weightings"

const props = new Set(properties)
, usage: R = {}
, siblings: R = {}
// , siblingAreas: RS = {}
, unique: R = {}
, singles: S = new Set()
, positions: R = {}
, positioned: R = {}
, positionAreas: R = {}
, befores: R = {}
, afters: R = {}

for (const property of props) {
  const chunks = property.split('-').filter(Boolean)
  , {length} = chunks

  for (let i = length; i--;) {
    const term = chunks[i]
    , pos = `${i + 1}/${length}`
    , sibls = (
      siblings[term] = siblings[term] ?? new Set(),
      siblings[term]
    )
    
    chunks.forEach(sib => sibls.add(sib))

    positions[pos] = (positions[pos] ?? new Set()).add(term)
    positioned[term] = (positioned[term] ?? new Set()).add(pos)
    usage[term] = (usage[term] ?? new Set()).add(property)
    
    if (i > 0) {
      befores[term] = (befores[term] ?? new Set())
      chunks.slice(0, i).forEach(chunk => befores[term].add(chunk))
    }
    if (length >= 2 && i < length - 1) {
      afters[term] = (afters[term] ?? new Set())
      chunks.slice(i).forEach(chunk => afters[term].add(chunk))
    }
  }
}

// Singles
for (const property of props) {
  const chunks = property.split('-').filter(Boolean)

  if (!chunks.every(term => usage[term]?.size === 1))
    continue
  
  singles.add(property)
  chunks.forEach(term => {
    delete usage[term]
    delete siblings[term]
    delete positioned[term]
  })
}

// Uniques 
for (const term in usage) {
  const used = usage[term]
  if (used.size === 1) {
    const prop = [...used][0]
    unique[prop] = (unique[prop] ?? new Set()).add(term)
    delete usage[term]
    delete siblings[term]
    delete positioned[term]
  }
}

//Position areas
for (const term in positioned) {
  const poses = [...positioned[term]].sort().join(', ')
  positionAreas[poses] = (positionAreas[poses] ?? new Set()).add(term)
}

const used = new Set(Object.keys(usage))
, weightsForward = weighting(used, afters, befores)
, weightsBackward = weighting(used, befores, afters)

weightsBackward.reverse()
// , weights: S[] = []

// let fi = 0, bi = 0
// while (true) {
//   const fronts = weightsForward[fi]
//   , backs = weightsBackward[bi] 
//   , stats: [S, S, S] = [new Set(), new Set(), new Set()]

//   for (const term of [...fronts, ...backs]) {
//     stats[
//       -1
//       + (fronts.has(term) ? 1 : 0)
//       + (backs.has(term) ? 2 : 0)
//     ].add(term)
//   }

//   console.log(stats)
//   process.exit()
// }

// for (const term in siblings) {
//   const area = [...siblings[term]]
//   .sort()
//   .join('-')

//   siblingAreas[area] = (siblingAreas[area] ?? new Set()).add(term)
// }


console.log(JSON.stringify({
  weightsForward,
  weightsBackward,
  // positionStats: Object.entries(positionAreas)
  // .sort(([k1], [k2]) => k1 === k2 ? 0 : k1 > k2 ? 1 : -1),
  singles,
  unique,
  usage,
  // siblingAreas: Object.values(siblingAreas).filter(l => l.size > 1),
  siblings,
  positions,
  positioned,
  positionAreas

}, (_, v) => v instanceof Set ? [...v].sort() : v, 2))
