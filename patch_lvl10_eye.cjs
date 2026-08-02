const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetEye = `          // Core background
          ctx.fillStyle = '#0a0a1a';
          ctx.beginPath();
          ctx.moveTo(0, -eyeRad);
          ctx.lineTo(eyeRad * 0.85, 0);
          ctx.lineTo(0, eyeRad);
          ctx.lineTo(-eyeRad * 0.85, 0);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 4;
          ctx.stroke();

          // Inner Sclera
          ctx.fillStyle = isVulnerable ? \`rgba(255, 255, 255, \${0.8 + eyePulse*0.2})\` : \`rgba(0, 255, 255, \${0.7 + eyePulse*0.3})\`;
          ctx.shadowBlur = isVulnerable ? 50 : 25;
          ctx.shadowColor = accentColor;
          ctx.beginPath();
          ctx.moveTo(0, -eyeRad * 0.7);
          ctx.lineTo(eyeRad * 0.6, 0);
          ctx.lineTo(0, eyeRad * 0.7);
          ctx.lineTo(-eyeRad * 0.6, 0);
          ctx.closePath();
          ctx.fill();`;

const replacementEye = `          // Core background (Outer Eyelids)
          ctx.fillStyle = '#0a0a1a';
          ctx.beginPath();
          ctx.moveTo(-eyeRad, 0);
          ctx.quadraticCurveTo(0, -eyeRad * 0.8, eyeRad, 0); // top lid
          ctx.quadraticCurveTo(0, eyeRad * 0.8, -eyeRad, 0); // bottom lid
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 4;
          ctx.stroke();

          // Inner Sclera
          ctx.fillStyle = isVulnerable ? \`rgba(255, 255, 255, \${0.8 + eyePulse*0.2})\` : \`rgba(0, 255, 255, \${0.7 + eyePulse*0.3})\`;
          ctx.shadowBlur = isVulnerable ? 50 : 25;
          ctx.shadowColor = accentColor;
          ctx.beginPath();
          ctx.moveTo(-eyeRad * 0.8, 0);
          ctx.quadraticCurveTo(0, -eyeRad * 0.6, eyeRad * 0.8, 0);
          ctx.quadraticCurveTo(0, eyeRad * 0.6, -eyeRad * 0.8, 0);
          ctx.closePath();
          ctx.fill();`;

code = code.replace(targetEye, replacementEye);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
