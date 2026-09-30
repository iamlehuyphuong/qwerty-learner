const fs = require('fs');

const fixFile = (filePath, replacements) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', filePath);
  }
};

fixFile('src/pages/Gallery-N/Chapter/index.tsx', {
  "KHÔNG. {index + 1} chương": "Chương {index + 1}",
  "luyện tập ${chapterStatus.exerciseCount} hạng hai": "Đã tập ${chapterStatus.exerciseCount} lần",
  "Chưa thực hành": "Chưa tập",
  "đang tải...": "Đang tải..."
});

fixFile('src/pages/Typing/components/ResultScreen/index.tsx', {
  "KHÔNG.${currentChapter + 1}chương": "Chuong_${currentChapter + 1}",
  "'KHÔNG.' + (currentChapter + 1) + 'chương'": "'Chương ' + (currentChapter + 1)",
  "Nhận xét những câu hỏi sai": "Ôn tập từ gõ sai",
  "thời gian chương": "Thời gian hoàn thành",
  "Viết chương này trong im lặng": "Luyện tập lại chương này",
  "chương tiếp theo": "Chương tiếp theo",
  "Luyện tập các chương khác": "Luyện tập chương khác"
});

fixFile('src/pages/Typing/components/ShareButton/SharePicDialog.tsx', {
  "KHÔNG. ${currentChapter + 1} chương": "Chương ${currentChapter + 1}"
});

console.log('Done fixing chapter translations!');
