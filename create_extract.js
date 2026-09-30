const fs = require('fs')

const content = fs.readFileSync('src/resources/dictionary.ts', 'utf8')

// Strip out imports and types
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
  "# Danh sách chương trình tiếng Anh\\n\\n" +
  "| ID | Danh mục (Category) | Phân loại (Tags) | Tên chương trình | Mô tả | Số từ |\\n" +
  "|---|---|---|---|---|---|\\n" +
  englishDicts.map(d => \`| \${d.id} | \${d.category} | \${d.tags.join(', ')} | \${d.name} | \${d.description} | \${d.length} |\`).join('\\n');

fs.writeFileSync('/Users/macos/.gemini/antigravity-ide/brain/1dd73993-7fc2-4a9a-b639-7fa306c1fb20/english_dicts_report.md', markdownTable);
console.log('Report generated with ' + englishDicts.length + ' dictionaries.');
`

fs.writeFileSync('run_extract.js', script)
