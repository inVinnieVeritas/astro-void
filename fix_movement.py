import re

with open('src/components/AsteroidsCanvas.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "ufo.y = Math.max((canvasRef.current?.height || window.innerHeight) * 0.35, 320) + Math.sin(Date.now() * 0.0025) * 20;",
    "ufo.y = Math.max((canvasRef.current?.height || window.innerHeight) * 0.35, 320 * (ufo.bossScale || 1)) + Math.sin(Date.now() * 0.0025) * 20;"
)
content = content.replace(
    "const minSafeX = Math.max(ufo.radius + 40, 320); // Keep away from left HUD",
    "const minSafeX = Math.max(ufo.radius + 40, 320 * (ufo.bossScale || 1)); // Keep away from left HUD"
)
# Check for other 320s
content = content.replace(
    "const minX = Math.max(ufo.radius + 30, 320);",
    "const minX = Math.max(ufo.radius + 30, 320 * (ufo.bossScale || 1));"
)

with open('src/components/AsteroidsCanvas.tsx', 'w') as f:
    f.write(content)

