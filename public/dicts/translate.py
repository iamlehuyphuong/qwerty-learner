import json
import sys
import time
from googletrans import Translator

if len(sys.argv) > 1:
    file_path = sys.argv[1]
else:
    file_path = '/Users/macos/Work/WebApps/qwerty-learner/public/dicts/BEC_2_T.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

translator = Translator()

texts_to_translate = []
indices = []

for i, item in enumerate(data):
    if 'trans' in item:
        for j, text in enumerate(item['trans']):
            texts_to_translate.append(text)
            indices.append((i, j))

translated_texts = []
batch_size = 50

print(f"Total to translate: {len(texts_to_translate)}")
for i in range(0, len(texts_to_translate), batch_size):
    batch = texts_to_translate[i:i+batch_size]
    print(f"Translating batch {i} to {i+len(batch)}...")
    success = False
    retries = 3
    while not success and retries > 0:
        try:
            # We can combine using a delimiter for googletrans to save requests
            combined = "\n\n".join(batch)
            res = translator.translate(combined, src='zh-cn', dest='vi')
            parts = [p.strip() for p in res.text.split("\n") if p.strip()]
            
            if len(parts) == len(batch):
                translated_texts.extend(parts)
                success = True
            else:
                raise Exception(f"Length mismatch: {len(parts)} != {len(batch)}")
            
            time.sleep(1.5)
        except Exception as e:
            print(f"Failed: {e}. Retrying... ({retries} left)")
            # fallback one by one
            try:
                print("Falling back to 1-by-1 internally for this batch")
                batch_res = []
                for text in batch:
                    r = translator.translate(text, src='zh-cn', dest='vi')
                    batch_res.append(r.text)
                    time.sleep(0.3)
                if len(batch_res) == len(batch):
                    translated_texts.extend(batch_res)
                    success = True
            except Exception as e2:
                print(f"1-by-1 failed too: {e2}")
            
            if not success:
                time.sleep(5)
                retries -= 1
            
    if not success:
        print("Fatal error: could not translate batch.")
        # just copy original
        translated_texts.extend(batch)
                
if len(translated_texts) != len(texts_to_translate):
    print(f"Length mismatch! {len(translated_texts)} vs {len(texts_to_translate)}")
    sys.exit(1)

for k, (i, j) in enumerate(indices):
    data[i]['trans'][j] = translated_texts[k]

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Done translating!")
