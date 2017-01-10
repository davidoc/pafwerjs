#!/usr/bin/env python

import json
import glob
from os.path import splitext, basename

words = {}
USE_DIRTY = False

src = "txt/*"
dest = "js/wordlist.js"

for _file in glob.glob(src):
    if "dirty_" in _file and not USE_DIRTY:
        continue
    with open(_file, 'r') as f:
        place = splitext(basename(_file))[0]
        # using list(set( words )) unique-ifies the words
        words[place] = list(set([i.strip() for i in f]))

with open(dest, 'w') as f:
    f.write("var words = ")
    json.dump(words, f)
    f.write(";")
