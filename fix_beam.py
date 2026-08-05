import re

with open('src/components/AsteroidsCanvas.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "if (distToBeam < 35 && proj > 0 && proj < 1600) {",
    "if (distToBeam < 35 * (ufo.bossScale || 1) && proj > 0 && proj < 1600) {"
)
content = content.replace(
    "ctx.lineWidth = 60; // visual radius matches collision radius of 35",
    "ctx.lineWidth = 60 * (ufo.bossScale || 1); // visual radius matches collision radius of 35"
)
content = content.replace(
    "const railLen = rad + 15;",
    "const railLen = rad + 15 * (ufo.bossScale || 1);"
)
with open('src/components/AsteroidsCanvas.tsx', 'w') as f:
    f.write(content)

