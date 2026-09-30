const fs = require('fs')
const path = require('path')

const idsToDelete = [
  'cet4',
  'cet6',
  'xinghuoqiaoji_4',
  'xinghuoqiaoji_6',
  'cet4-sub',
  'cet6-sub',
  'kaoyan',
  'kaoyan_2024',
  'kaoyanshanguo_2023',
  '926',
  'dancimimi_1',
  'dancimimi_2',
  '2024HongBao T1',
  '2024HongBao T2',
  'Sách Đỏ-2026',
  'English_II',
  'kaoyanshanguo2025',
  'level4',
  'level8',
  'archVocabulary',
  'itVocabulary',
  'pets3',
  'pets3-2023',
  'self-study_English1',
  'self-study_English2',
  'self-study_English3',
  'adult self-study examination',
  'zhuan-cha-ben-ying-yu',
  'zhuan-sheng-ben-xue-shi',
  'tingshuokaoshi',
  '2025KaoYanHongBaoShu',
  '3000_ClassRoom_English_Words',
  'frequently_used_words01',
  'frequently_used_words03',
]

let content = fs.readFileSync('src/resources/dictionary.ts', 'utf8')

// The file has a structure: const chinaExam: DictionaryResource[] = [ ... ]
// To be safe, we can use a regex to match the objects and remove them.
// But it's easier to find the URL for each ID and delete the JSON.
const blockRegex = /\{\s*id:\s*'([^']+)',[\s\S]*?url:\s*'([^']+)',[\s\S]*?\}/g
let match
const urlsToDelete = []

while ((match = blockRegex.exec(content)) !== null) {
  if (idsToDelete.includes(match[1])) {
    urlsToDelete.push(match[2])
  }
}

// 1. Delete JSON files
let deletedCount = 0
for (const url of urlsToDelete) {
  const filePath = path.join('public', url)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    deletedCount++
  }
}
console.log(`Deleted ${deletedCount} JSON files.`)

// 2. Remove the blocks from dictionary.ts
for (const id of idsToDelete) {
  // Regex to match the entire dictionary object for the given id
  const regex = new RegExp(`\\{\\s*id:\\s*'${id}',[\\s\\S]*?\\},?`, 'g')
  content = content.replace(regex, '')
}

// 3. Move the remaining ones in chinaExam to englishDict or change their category
content = content.replace(/category:\s*'Kỳ thi Trung Quốc'/g, "category: 'Từ điển Tiếng Anh'")

fs.writeFileSync('src/resources/dictionary.ts', content)
console.log('Cleaned up dictionary.ts!')
