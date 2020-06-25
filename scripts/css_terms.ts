import data from "../docs/mdn-yari-css/reference/index.json"

const str =  data.doc.body[2].value.content
, parser = /<code>([^<]*)<\/code>/g
, pattern = {
  "props_units": /^[a-z\-]+$/,
  "function": /^[a-z\-]+(X|Y|Z|3d)?\(\)$/,
  "term": /^\<[^>]+\>$/,
  "pseudoSelector": /^:[^:]/,
  "pseudoElement": /^::/,
  "directive": /^@/,
  "directiveProperty": /^.* \(@.*\)$/,
  "customProperty": /^--/,
  "frequencyUnit": /^k?Hz$/,
  "length-1/4mm": /^Q$/
}
, kinds = Object.fromEntries(
  ['unknown', ...Object.keys(pattern)]
  .map(key => [key as keyof typeof pattern, [] as string[]])
)
, htmlUnescapes = {
  '&lt;': '<',
  '&gt;': '>',
}
, parsed = [...str.matchAll(parser)]
.map(([_, property]) =>
  property
  //@ts-ignore
  .replace(/&[^;]+;/g, escaped => htmlUnescapes[escaped])
)

terms: for (const term of parsed) {
  for (const kind in pattern) {
    if (term.match(pattern[kind as keyof typeof pattern])) {
      kinds[kind].push(term)
      continue terms
    }
  }
  kinds['unknown'].push(term)
}

console.log(JSON.stringify(kinds, null, 2))

//TODO Extract <h3 id=\"Combinators\">Combinators</h3>