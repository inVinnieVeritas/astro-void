import re

with open('src/components/AsteroidsCanvas.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "y: Math.max(h * 0.28, 220),",
    "y: Math.max(h * 0.28, 220 * currentBossScale),"
)
content = content.replace(
    "radius: 115,",
    "radius: 115 * currentBossScale,\nbossScale: currentBossScale,"
)
content = content.replace(
    "y: isCoreSeverance ? h * 0.35 : Math.max(h * 0.35, 320), // Safely below top UI elements",
    "y: isCoreSeverance ? Math.max(h * 0.35, 200 * currentBossScale) : Math.max(h * 0.35, 250 * currentBossScale), // Safely below top UI elements"
)
content = content.replace(
    "radius: isCoreSeverance ? 90 : 110,",
    "radius: (isCoreSeverance ? 90 : 110) * currentBossScale,\nbossScale: currentBossScale,"
)
content = content.replace(
    "radius: 35,",
    "radius: 35 * currentBossScale,\nbossScale: currentBossScale,"
)
content = content.replace(
    "orbitRadius: 220,",
    "orbitRadius: 220 * currentBossScale,"
)

with open('src/components/AsteroidsCanvas.tsx', 'w') as f:
    f.write(content)

