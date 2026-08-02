const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetStr = code.substring(
  code.indexOf('          // Outer Cranial Armor Plates (Tech/Robot Head Silhouette)'),
  code.indexOf('          // Core Processing Node (Mouth/Central Reactor)')
);

const replacement = `          // Angular TRON disk hull
          ctx.beginPath();
          ctx.moveTo(0, -rad * 1.2);
          ctx.lineTo(rad * 0.6, -rad * 0.8);
          ctx.lineTo(rad * 1.2, 0);
          ctx.lineTo(rad * 0.6, rad * 0.8);
          ctx.lineTo(0, rad * 1.2);
          ctx.lineTo(-rad * 0.6, rad * 0.8);
          ctx.lineTo(-rad * 1.2, 0);
          ctx.lineTo(-rad * 0.6, -rad * 0.8);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          // Internal biomechanic circuitry ribs
          ctx.save();
          ctx.strokeStyle = '#00ffff';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ffff';
          
          for(let i=0; i<8; i++) {
             const angle = (i/8) * Math.PI * 2;
             ctx.beginPath();
             ctx.moveTo(Math.cos(angle) * rad * 0.3, Math.sin(angle) * rad * 0.3);
             ctx.lineTo(Math.cos(angle) * rad * 0.9, Math.sin(angle) * rad * 0.9);
             // Circuit branches
             const branchA = angle + Math.PI/8;
             const branchB = angle - Math.PI/8;
             ctx.lineTo(Math.cos(branchA) * rad * 1.0, Math.sin(branchA) * rad * 1.0);
             ctx.moveTo(Math.cos(angle) * rad * 0.9, Math.sin(angle) * rad * 0.9);
             ctx.lineTo(Math.cos(branchB) * rad * 1.0, Math.sin(branchB) * rad * 1.0);
             ctx.stroke();
          }
          ctx.restore();

`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
console.log('Dreadnought hull patched');
