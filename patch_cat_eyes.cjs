const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetEyes = `          // Left Eye Sensor (Sclera)
          ctx.beginPath();
          ctx.moveTo(-rad * 0.7, -rad * 0.2);
          ctx.lineTo(-rad * 0.3, -rad * 0.3);
          ctx.lineTo(-rad * 0.3, -rad * 0.05);
          ctx.lineTo(-rad * 0.6, 0);
          ctx.closePath();
          ctx.fill();

          // Right Eye Sensor (Sclera)
          ctx.beginPath();
          ctx.moveTo(rad * 0.7, -rad * 0.2);
          ctx.lineTo(rad * 0.3, -rad * 0.3);
          ctx.lineTo(rad * 0.3, -rad * 0.05);
          ctx.lineTo(rad * 0.6, 0);
          ctx.closePath();
          ctx.fill();
          
          // Bright Pupils
          ctx.globalAlpha = 0.9 + eyePulse * 0.1;
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 40;
          ctx.beginPath();
          ctx.arc(-rad * 0.45, -rad * 0.15, rad * 0.08, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(rad * 0.45, -rad * 0.15, rad * 0.08, 0, Math.PI * 2);
          ctx.fill();`;

const replacementEyes = `          // Left Eye Sensor (Cat Sclera)
          ctx.beginPath();
          ctx.moveTo(-rad * 0.8, -rad * 0.25); // outer corner
          ctx.lineTo(-rad * 0.4, -rad * 0.4); // top arc
          ctx.lineTo(-rad * 0.2, -rad * 0.1); // inner corner
          ctx.lineTo(-rad * 0.4, -rad * 0.05); // bottom arc
          ctx.closePath();
          ctx.fill();

          // Right Eye Sensor (Cat Sclera)
          ctx.beginPath();
          ctx.moveTo(rad * 0.8, -rad * 0.25);
          ctx.lineTo(rad * 0.4, -rad * 0.4);
          ctx.lineTo(rad * 0.2, -rad * 0.1);
          ctx.lineTo(rad * 0.4, -rad * 0.05);
          ctx.closePath();
          ctx.fill();
          
          // Glowing Slit Pupils (Feline)
          ctx.globalAlpha = 0.9 + eyePulse * 0.1;
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 40;
          ctx.beginPath();
          ctx.ellipse(-rad * 0.45, -rad * 0.2, rad * 0.03, rad * 0.12, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(rad * 0.45, -rad * 0.2, rad * 0.03, rad * 0.12, -0.2, 0, Math.PI * 2);
          ctx.fill();`;

code = code.replace(targetEyes, replacementEyes);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
