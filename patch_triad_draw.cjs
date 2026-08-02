const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetTriadDraw = `        } else if (ufo.type === 'core_severance') {
          // --- LEVEL 10 FINAL BOSS: CORE SEVERANCE (BIBLICALLY ACCURATE AI SERAPHIM) ---`;

const replacementTriadDraw = `        } else if (ufo.type === 'triad_core') {
          // --- WAVE 15 FINAL BOSS: TRIAD PROTOCOL ---
          const triadCores = ufosRef.current.filter(u => u.type === 'triad_core');
          const isLinked = triadCores.length > 1;
          const isBerserk = triadCores.length === 1;
          const rad = ufo.radius;
          
          ctx.save();
          // Draw energy beams connecting them (only draw from the first core to avoid overlap)
          if (isLinked && ufo.id === triadCores[0].id) {
             ctx.save();
             // Draw connecting laser tethers
             ctx.lineWidth = 6 + Math.sin(now * 0.015) * 3;
             ctx.strokeStyle = '#00ffff';
             ctx.shadowBlur = 30;
             ctx.shadowColor = '#00ffff';
             ctx.beginPath();
             for(let c = 0; c < triadCores.length; c++) {
                const core = triadCores[c];
                if (c === 0) ctx.moveTo(core.x, core.y);
                else ctx.lineTo(core.x, core.y);
             }
             if (triadCores.length > 2) ctx.closePath();
             ctx.stroke();
             
             // Inner brighter beam
             ctx.lineWidth = 2;
             ctx.strokeStyle = '#ffffff';
             ctx.shadowBlur = 10;
             ctx.beginPath();
             for(let c = 0; c < triadCores.length; c++) {
                const core = triadCores[c];
                if (c === 0) ctx.moveTo(core.x, core.y);
                else ctx.lineTo(core.x, core.y);
             }
             if (triadCores.length > 2) ctx.closePath();
             ctx.stroke();
             ctx.restore();
          }

          ctx.translate(ufo.x, ufo.y);
          
          const pulse = (Math.sin(now * (isBerserk ? 0.02 : 0.01)) + 1) / 2;
          const coreColor = isBerserk ? '#ff0055' : '#a855f7';
          const accentColor = isBerserk ? '#ffaa00' : '#00ffff';

          // Outer corrupted rings
          ctx.save();
          ctx.rotate(now * (isBerserk ? 0.005 : 0.002));
          ctx.strokeStyle = coreColor;
          ctx.shadowBlur = 20 + pulse * 20;
          ctx.shadowColor = coreColor;
          ctx.lineWidth = 4;
          
          // Hexagon orbit
          ctx.beginPath();
          for(let i=0; i<6; i++) {
             const a = (i/6) * Math.PI * 2;
             const r = rad * 1.1 + Math.sin(now * 0.01 + i) * 10;
             if (i===0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r);
             else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
          }
          ctx.closePath();
          ctx.stroke();
          
          // Outer nodes
          ctx.fillStyle = accentColor;
          for(let i=0; i<6; i++) {
             const a = (i/6) * Math.PI * 2;
             const r = rad * 1.1 + Math.sin(now * 0.01 + i) * 10;
             ctx.beginPath();
             ctx.arc(Math.cos(a)*r, Math.sin(a)*r, 6, 0, Math.PI*2);
             ctx.fill();
          }
          ctx.restore();

          // Central Faceted Mainframe
          ctx.rotate(-now * 0.001);
          
          const grad = ctx.createRadialGradient(0, 0, rad * 0.1, 0, 0, rad);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, coreColor);
          grad.addColorStop(1, '#05030f');
          
          ctx.fillStyle = grad;
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -rad);
          ctx.lineTo(rad * 0.866, -rad * 0.5);
          ctx.lineTo(rad * 0.866, rad * 0.5);
          ctx.lineTo(0, rad);
          ctx.lineTo(-rad * 0.866, rad * 0.5);
          ctx.lineTo(-rad * 0.866, -rad * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Inner eye / core
          ctx.fillStyle = isBerserk ? '#ffaa00' : '#ffffff';
          ctx.shadowBlur = 40;
          ctx.shadowColor = ctx.fillStyle;
          ctx.beginPath();
          ctx.ellipse(0, 0, rad * 0.2, rad * 0.4 + pulse * rad * 0.1, 0, 0, Math.PI*2);
          ctx.fill();
          
          ctx.restore();

        } else if (ufo.type === 'core_severance') {
          // --- LEVEL 10 FINAL BOSS: CORE SEVERANCE (BIBLICALLY ACCURATE AI SERAPHIM) ---`;

if (code.includes(targetTriadDraw)) {
  code = code.replace(targetTriadDraw, replacementTriadDraw);
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
  console.log('Successfully replaced triad draw.');
} else {
  console.log('Triad Draw target not found!');
}
