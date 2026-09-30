const fs = require('fs')
const content = fs.readFileSync('src/resources/dictionary.ts', 'utf8')

const dicts = []
// Match the { ... } blocks
const blockRegex =
  /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*description:\s*'([^']*)',\s*category:\s*'([^']+)',\s*tags:\s*\[([^\]]+)\],\s*url:\s*'([^']+)',\s*length:\s*(\d+),\s*language:\s*'([^']+)',\s*languageCategory:\s*'([^']+)',?\s*\}/g

let match
while ((match = blockRegex.exec(content)) !== null) {
  dicts.push({
    id: match[1],
    name: match[2],
    description: match[3],
    category: match[4],
    tags: match[5].replace(/['"\s]/g, '').split(','),
    url: match[6],
    length: parseInt(match[7], 10),
    language: match[8],
    languageCategory: match[9],
  })
}

const englishDicts = dicts.filter((d) => d.languageCategory === 'en')

const markdownTable =
  '# Danh sách chương trình tiếng Anh\n\n' +
  '| ID | Danh mục (Category) | Phân loại (Tags) | Tên chương trình | Mô tả | Số từ |\n' +
  '|---|---|---|---|---|---|\n' +
  englishDicts.map((d) => `| ${d.id} | ${d.category} | ${d.tags.join(', ')} | ${d.name} | ${d.description} | ${d.length} |`).join('\n')

fs.writeFileSync('/Users/macos/.gemini/antigravity-ide/brain/1dd73993-7fc2-4a9a-b639-7fa306c1fb20/english_dicts_report.md', markdownTable)
console.log('Report generated with ' + englishDicts.length + ' dictionaries.')
