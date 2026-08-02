const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const target = `        } else if (ufo.type === 'dreadnought') {
          const rad = ufo.radius;
          const coreRot = now * 0.003;
          const isOverheated = ufo.bossState === 'cooldown';
          const phaseColor = isOverheated ? '#ffffff' : ufo.bossPhase === 2 ? '#ff0055' : '#e11d48';`;

const replacement = `        } else if (ufo.type === 'dreadnought') {
          const rad = ufo.radius;
          const coreRot = now * 0.003;
          const isOverheated = ufo.bossState === 'cooldown';
          const phaseColor = isOverheated ? '#ffffff' : ufo.bossPhase === 2 ? '#ffaa00' : '#00ffff'; // TRON cyan and overheat amber`;

code = code.replace(target, replacement);

const target2 = `          // AI Mainframe Core / Corrupted Robot Head Hull
          const hullGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, rad);
          hullGrad.addColorStop(0, '#110b29');
          hullGrad.addColorStop(0.5, '#0d091e');
          hullGrad.addColorStop(1, '#020108');`;

const replacement2 = `          // TRON Biomechanic Mainframe Core
          const hullGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, rad);
          hullGrad.addColorStop(0, '#020108');
          hullGrad.addColorStop(0.6, '#080515');
          hullGrad.addColorStop(1, '#000000');`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
console.log('Dreadnought patched safely');
