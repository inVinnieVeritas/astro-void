const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetOuterPlates = `          // Top Crown and Horns
          ctx.moveTo(-rad * 0.3, -rad * 1.25);
          ctx.lineTo(0, -rad * 1.15);
          ctx.lineTo(rad * 0.3, -rad * 1.25);
          ctx.lineTo(rad * 0.6, -rad * 1.05);
          ctx.lineTo(rad * 0.95, -rad * 1.25); // Right Horn peak
          ctx.lineTo(rad * 1.0, -rad * 0.8);
          ctx.lineTo(rad * 1.2, -rad * 0.5); // Upper sides
          ctx.lineTo(rad * 1.1, rad * 0.2);
          ctx.lineTo(rad * 0.9, rad * 0.7); // Lower jaw/cheeks
          ctx.lineTo(rad * 0.45, rad * 1.25);
          ctx.lineTo(0, rad * 1.1); // Chin center dip
          ctx.lineTo(-rad * 0.45, rad * 1.25); // Chin area
          ctx.lineTo(-rad * 0.9, rad * 0.7);
          ctx.lineTo(-rad * 1.1, rad * 0.2);
          ctx.lineTo(-rad * 1.2, -rad * 0.5);
          ctx.lineTo(-rad * 1.0, -rad * 0.8);
          ctx.lineTo(-rad * 0.95, -rad * 1.25); // Left Horn peak
          ctx.lineTo(-rad * 0.6, -rad * 1.05);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();`;

const replacementOuterPlates = `          // Cat-like Ears and Feline Silhouette
          ctx.moveTo(-rad * 0.3, -rad * 1.0); // top head
          ctx.lineTo(0, -rad * 1.05);
          ctx.lineTo(rad * 0.3, -rad * 1.0);
          ctx.lineTo(rad * 0.6, -rad * 1.1); // right ear base
          ctx.lineTo(rad * 0.85, -rad * 1.6); // right ear tip (tall and pointy)
          ctx.lineTo(rad * 1.05, -rad * 0.9); // right ear outer base
          ctx.lineTo(rad * 1.35, -rad * 0.2); // wide right cheek
          ctx.lineTo(rad * 1.2, rad * 0.4);
          ctx.lineTo(rad * 0.8, rad * 0.8); // jawline
          ctx.lineTo(rad * 0.4, rad * 1.2); // chin point right
          ctx.lineTo(0, rad * 1.1); // chin dip
          ctx.lineTo(-rad * 0.4, rad * 1.2); // chin point left
          ctx.lineTo(-rad * 0.8, rad * 0.8);
          ctx.lineTo(-rad * 1.2, rad * 0.4);
          ctx.lineTo(-rad * 1.35, -rad * 0.2); // wide left cheek
          ctx.lineTo(-rad * 1.05, -rad * 0.9);
          ctx.lineTo(-rad * 0.85, -rad * 1.6); // left ear tip
          ctx.lineTo(-rad * 0.6, -rad * 1.1);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();`;

code = code.replace(targetOuterPlates, replacementOuterPlates);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
