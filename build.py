import os
import re

files = [
    "js/constants.js",
    "js/blockPatterns.js",
    "js/pathfinder.js",
    "js/mapGenerator.js",
    "js/player.js",
    "js/enemyA.js",
    "js\enemyB.js",
    "js/uiManager.js",
    "js/main.js"
]

output_file = "bundle.js"

with open(output_file, "w", encoding="utf-8") as outfile:
    for fname in files:
        fname = fname.replace("\\", "/")
        with open(fname, "r", encoding="utf-8") as infile:
            content = infile.read()
            
            # Remove imports
            content = re.sub(r'(?m)^import\s+.*$', '', content)
            # Remove exports
            content = re.sub(r'(?m)^export\s+(const|let|var|class|function)', r'\1', content)
            content = re.sub(r'(?m)^export\s+default\s+(class|function)', r'\1', content)
            
            outfile.write(f"/* --- {fname} --- */\n")
            outfile.write(content + "\n")

print("Bundle created successfully using Python.")
