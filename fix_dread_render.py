import re

with open('src/components/AsteroidsCanvas.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const shR = rad + 35;",
    "const bScale = ufo.bossScale || 1;\n          const shR = rad + 35 * bScale;"
)
content = content.replace(
    "const arrowDist = shR + 45 + gapPulse * 25;",
    "const arrowDist = shR + (45 + gapPulse * 25) * bScale;"
)
# also look at "ctx.arc(0, 0, shR + 15"
content = content.replace(
    "ctx.arc(0, 0, shR + 15,",
    "ctx.arc(0, 0, shR + 15 * bScale,"
)
# And the mouth/weak point collisions? Wait, let's find Dreadnought collisions first.

with open('src/components/AsteroidsCanvas.tsx', 'w') as f:
    f.write(content)

