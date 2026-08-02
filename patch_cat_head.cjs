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

const targetCrownCrest = `          // Glowing Crown Crest
          ctx.strokeStyle = isOverheated ? '#ffffff' : '#ff0055';
          ctx.shadowBlur = 20;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-rad * 0.15, -rad * 1.2);
          ctx.lineTo(0, -rad * 1.3);
          ctx.lineTo(rad * 0.15, -rad * 1.2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(-rad * 0.85, -rad * 1.2);
          ctx.lineTo(-rad * 0.95, -rad * 1.4);
          ctx.lineTo(-rad * 1.05, -rad * 1.1);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(rad * 0.85, -rad * 1.2);
          ctx.lineTo(rad * 0.95, -rad * 1.4);
          ctx.lineTo(rad * 1.05, -rad * 1.1);
          ctx.stroke();`;

const replacementCrownCrest = `          // Glowing Feline Crest and Inner Ear TRON lines
          ctx.strokeStyle = isOverheated ? '#ffffff' : '#00ffff';
          ctx.shadowBlur = 20;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.lineWidth = 3;
          
          // Forehead V (classic TRON glow)
          ctx.beginPath();
          ctx.moveTo(-rad * 0.25, -rad * 0.95);
          ctx.lineTo(0, -rad * 0.65);
          ctx.lineTo(rad * 0.25, -rad * 0.95);
          ctx.stroke();
          
          // Inner Ear glowing lines (Left)
          ctx.beginPath();
          ctx.moveTo(-rad * 0.7, -rad * 1.15);
          ctx.lineTo(-rad * 0.85, -rad * 1.5);
          ctx.lineTo(-rad * 0.95, -rad * 1.0);
          ctx.stroke();
          
          // Inner Ear glowing lines (Right)
          ctx.beginPath();
          ctx.moveTo(rad * 0.7, -rad * 1.15);
          ctx.lineTo(rad * 0.85, -rad * 1.5);
          ctx.lineTo(rad * 0.95, -rad * 1.0);
          ctx.stroke();`;
code = code.replace(targetCrownCrest, replacementCrownCrest);

const targetFacePlate = `          // Inner Face Plate (Darker inset)
          ctx.fillStyle = '#05030f';
          ctx.beginPath();
          ctx.moveTo(-rad * 0.45, -rad * 1.0);
          ctx.lineTo(0, -rad * 0.9);
          ctx.lineTo(rad * 0.45, -rad * 1.0);
          ctx.lineTo(rad * 0.7, -rad * 0.7);
          ctx.lineTo(rad * 0.95, -rad * 0.45);
          ctx.lineTo(rad * 0.9, rad * 0.1);
          ctx.lineTo(rad * 0.7, rad * 0.55);
          ctx.lineTo(rad * 0.35, rad * 1.0);
          ctx.lineTo(0, rad * 0.85);
          ctx.lineTo(-rad * 0.35, rad * 1.0);
          ctx.lineTo(-rad * 0.7, rad * 0.55);
          ctx.lineTo(-rad * 0.9, rad * 0.1);
          ctx.lineTo(-rad * 0.95, -rad * 0.45);
          ctx.lineTo(-rad * 0.7, -rad * 0.7);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();`;
          
const replacementFacePlate = `          // Inner Face Plate (Cat Snout / Mask outline)
          ctx.fillStyle = '#05030f';
          ctx.beginPath();
          ctx.moveTo(-rad * 0.4, -rad * 0.85);
          ctx.lineTo(0, -rad * 0.75);
          ctx.lineTo(rad * 0.4, -rad * 0.85);
          ctx.lineTo(rad * 0.75, -rad * 0.55); // Inner ear base
          ctx.lineTo(rad * 0.95, -rad * 0.1); // cheekbone out
          ctx.lineTo(rad * 0.65, rad * 0.45); // jaw in
          ctx.lineTo(rad * 0.35, rad * 0.95);
          ctx.lineTo(0, rad * 0.8); // nose / mouth bridge
          ctx.lineTo(-rad * 0.35, rad * 0.95);
          ctx.lineTo(-rad * 0.65, rad * 0.45);
          ctx.lineTo(-rad * 0.95, -rad * 0.1); // cheekbone
          ctx.lineTo(-rad * 0.75, -rad * 0.55);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();`;
code = code.replace(targetFacePlate, replacementFacePlate);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
