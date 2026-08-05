import re

with open('src/components/AsteroidsCanvas.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const targetX = boss.x + Math.cos(ufo.orbitAngle) * 160;",
    "const targetX = boss.x + Math.cos(ufo.orbitAngle) * 160 * (boss.bossScale || 1);"
)
content = content.replace(
    "const targetY = boss.y + Math.sin(ufo.orbitAngle) * 100;",
    "const targetY = boss.y + Math.sin(ufo.orbitAngle) * 100 * (boss.bossScale || 1);"
)
with open('src/components/AsteroidsCanvas.tsx', 'w') as f:
    f.write(content)

