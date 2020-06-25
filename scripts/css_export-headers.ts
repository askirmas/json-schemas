import {sync} from "globby"
import {readFileSync} from "fs"
type PPick<T,K extends keyof T> = Partial<Pick<T,K>>
type RS<K extends string = string, V = string> = Record<K, V>
type DocCompatibility = {
  "id": "Browser_compatibility",
  "query": string,
  "data"?: {
    "__compat": RS<string, never>
  }
} 
type DocSyntax = {
  "id": "Syntax"
  "content": string    
}
type DocSection = DocSyntax | DocCompatibility

type Description = RS<"title"|"summary"|"mdn_url"> & {
  body: {value: DocSection}[]
}
type DocIndex = {doc: Description}
type Extracted = Pick<Description, "title"|"summary"|"mdn_url">
& PPick<DocCompatibility, "query">
& Partial<{
  "compatibility": NonNullable<DocCompatibility["data"]>["__compat"]
  "formal": DocSyntax["content"]
}>

const {parse: $parse, stringify: $stringify} = JSON
, docsFolder = "docs/mdn-yari-css"
, file2search = "/index.json"
, files = sync(`**${file2search}`, {cwd: docsFolder, fullPath: true})
, {length} = files
, replaces = Object.entries({
  "_star_": "*",
  "_colon_": ":",
  "_doublecolon": "::"
})
, topicMap = {
  "Browser_compatibility": "compatibility",
  "Syntax": "formal"
} as const
, $return: Record<string, Extracted> = {}

for (let i = 0; i < length; i++) {
  const fileName = files[i]
  , name = replaces.reduce(
    (acc, [from, to]) => acc.replace(from, to),
    fileName.replace(file2search, '')
  )
  , {doc: {
    title, summary, mdn_url,
    body
  }} = readJson<DocIndex>(`${docsFolder}/${fileName}`)
  , out: Extracted = {title, summary, mdn_url}

  for (const {value} of body) {
    const key = topicMap[value.id]
    if (key === undefined)
      continue
    if (out[key]) {
      console.error(`${fileName}: "${key} already presented"`)
      continue
    }
    switch (value.id) {
      case "Syntax":
        out[topicMap[value.id]] = value.content
        .replace(/\s*(^.*>Formal syntax<\/h3>|\s+style="[^"]+")\s*/mg, '')
        .replace(/<a [^>]*>\|<\/a>/mg, '|')
        .replace(/(\n|\\n)+/mg, " ")
        .replace(/\s{2,}/mg, " ")
        .replace(/>\s+</, "><")
        break;
      case "Browser_compatibility":
        out[topicMap[value.id]] = value.data?.__compat
        break
    }
    
  }
    
  $return[name] = out
}

console.log($stringify($return, null, 2))

function readJson<T>(path: string) {
  return $parse(readFileSync(path).toString()) as T
}
