import re

file_path = r"c:\Users\basic\Documents\New folder\TheDeepVerse\course-detail.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will find where SIMPLE PRODUCT is
match = re.search(r"// \D+SIMPLE PRODUCT \(no variants\)\D+.*?else \{", content, re.DOTALL)
if match:
    print("Found SIMPLE PRODUCT block:")
    print(match.group(0))
else:
    print("Not found.")
