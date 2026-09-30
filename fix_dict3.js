const fs = require('fs')

const fixFile = (filePath, replacements) => {
  if (!fs.existsSync(filePath)) return
  let content = fs.readFileSync(filePath, 'utf8')
  let originalContent = content

  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value)
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content)
    console.log('Fixed:', filePath)
  }
}

fixFile('src/pages/Gallery-N/DictDetail/index.tsx', {
  'chung {dict.length} từ': 'Tổng cộng {dict.length} từ',
})

fixFile('src/resources/dictionary.ts', {
  'ZhangHongYancủaTOEFLtừHuệ Thư': 'Từ vựng TOEFL (ZhangHongYan)',
  'ZhangHongYancủaTOEFLTừ Huệ Thư': 'Từ vựng TOEFL (ZhangHongYan)',
  'Từ vựng TOEFL (ZhangHongYan)-từGhi theo danh mục': 'Từ vựng TOEFL (ZhangHongYan) - Theo chủ đề',
  'Từ vựng TOEFL (ZhangHongYan)-từTheo chủ đề': 'Từ vựng TOEFL (ZhangHongYan) - Theo chủ đề',
})

console.log('Done!')
