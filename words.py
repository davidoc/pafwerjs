#!/usr/bin/env python
from chardet.universaldetector import UniversalDetector
import json
import glob
from os.path import splitext, basename

words = {}
USE_DIRTY = False
dirty_prefixes = ['dirty_', 'Slang', 'Slurs']

src = "txt/*"
dest = "js/wordlist.js"
# src = "../pafwert/Wordlists/*.txt"
# dest = "js/pafwert-wordlist.js"

detector = UniversalDetector()
for _file in glob.glob(src):
    if not USE_DIRTY:
        is_dirty = [p for p in dirty_prefixes if p in _file]
        if is_dirty:
            continue
    detector.reset()
    with open(_file, 'r') as f:
        place = splitext(basename(_file))[0]
        # using list(set( words )) unique-ifies the words
        file_words = []
        for line in f:
            file_words.append(line.strip())
            detector.feed(line)
        detector.close()
        result = detector.result

        words[place] = list(set([line.decode(result['encoding']) for line in file_words]))

with open(dest, 'w') as f:
    f.write("var words = ")
    json.dump(words, f)
    f.write(";")
