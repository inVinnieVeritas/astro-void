const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetSecondarySensors = `          // Tiny secondary sensors
          ctx.fillStyle = '#00ffff';
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(-rad * 0.65, rad * 0.2, rad * 0.04, 0, Math.PI * 2);
          ctx.arc(rad * 0.65, rad * 0.2, rad * 0.04, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-rad * 0.2, -rad * 0.8, rad * 0.04, 0, Math.PI * 2);
          ctx.arc(rad * 0.2, -rad * 0.8, rad * 0.04, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = 1.0;`;

const replacementSecondarySensors = `          // Feline Glowing Fangs (Jawline)
          ctx.strokeStyle = isOverheated ? '#ffffff' : '#ff0055';
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 20;
          ctx.lineWidth = 3;
          ctx.beginPath();
          // Left Fangs
          ctx.moveTo(-rad * 0.5, rad * 0.4); ctx.lineTo(-rad * 0.35, rad * 0.7); ctx.lineTo(-rad * 0.2, rad * 0.5);
          ctx.lineTo(-rad * 0.1, rad * 0.65); ctx.lineTo(0, rad * 0.5);
          // Right Fangs
          ctx.lineTo(rad * 0.1, rad * 0.65); ctx.lineTo(rad * 0.2, rad * 0.5);
          ctx.lineTo(rad * 0.35, rad * 0.7); ctx.lineTo(rad * 0.5, rad * 0.4);
          ctx.stroke();

          // Tiny secondary sensors
          ctx.fillStyle = '#00ffff';
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(-rad * 0.75, rad * 0.2, rad * 0.04, 0, Math.PI * 2);
          ctx.arc(rad * 0.75, rad * 0.2, rad * 0.04, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = 1.0;`;

code = code.replace(targetSecondarySensors, replacementSecondarySensors);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
