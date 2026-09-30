const fs = require('fs')

// We'll parse the file using a regex approach since it's a TS file
const content = fs.readFileSync('src/resources/dictionary.ts', 'utf8')

// The file exports `dictionaries` at the end which is a concat of all arrays.
// It's a bit hard to eval the typescript file directly. Let's compile and run it.
// Oh wait, it has imports at the top:
// import type { Dictionary, DictionaryResource } from '@/typings/index'
// import { calcChapterCount } from '@/utils'

// We can simply strip the imports and type annotations, then eval it.
let script = content
  .replace(/import .*\n/g, '')
  .replace(/export const dictionaries = .*/, '')
  .replace(/: DictionaryResource\[\]/g, '')
  .replace(/export /g, '')

script += `
const allDicts = [
  ...chinaExam,
  ...internationalExam,
  ...englishDict,
  ...professionalDict,
  ...childrenEnglish,
  ...codeDict,
  ...japaneseDict,
  ...germanDict,
  ...kzDict,
  ...idDict
];

const englishDicts = allDicts.filter(d => d.languageCategory === 'en');

const markdownTable = 
  "| ID | Danh mục (Category) | Phân loại (Tags) | Tên chương trình | Mô tả | Số từ |\n" +
  "|---|---|---|---|---|---|\n" +
  englishDicts.map(d => \`| \${d.id} | \${d.category} | \${d.tags.join(', ')} | \${d.name} | \${d.description} | \${d.length} |\`).join('\\n');

fs.writeFileSync('english_dicts_report.md', markdownTable);
console.log('Report generated with ' + englishDicts.length + ' dictionaries.');
`

fs.writeFileSync('run_extract.js', script)
