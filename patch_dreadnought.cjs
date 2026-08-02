const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetHull = `          // AI Mainframe Core / Corrupted Robot Head Hull
          const hullGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, rad);
          hullGrad.addColorStop(0, '#110b29');
          hullGrad.addColorStop(0.5, '#0d091e');
          hullGrad.addColorStop(1, '#020108');

          ctx.fillStyle = hullGrad;
          ctx.strokeStyle = phaseColor;
          ctx.lineWidth = ufo.bossPhase === 2 ? 6 : 4;
          ctx.shadowBlur = isOverheated ? 45 : ufo.bossPhase === 2 ? 40 : 25;
          ctx.shadowColor = phaseColor;
          
          // Outer Cranial Armor Plates (Tech/Robot Head Silhouette)
          ctx.beginPath();
          // Cat-like Ears and Feline Silhouette
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
          ctx.fill();

          // Cyber-Feline Eyes (Intense and Angular)
          ctx.save();
          const eyeBlink = (Math.sin(now * 0.005) > 0.95) ? 0.1 : 1; // rapid blinking
          const eyeGlow = isOverheated ? '#ffffff' : (ufo.bossPhase === 2 ? '#ffcc00' : '#00ffff');
          
          // Right Eye
          ctx.fillStyle = eyeGlow;
          ctx.shadowColor = eyeGlow;
          ctx.shadowBlur = 40;
          ctx.beginPath();
          ctx.ellipse(rad * 0.5, -rad * 0.2, rad * 0.4, rad * 0.15 * eyeBlink, Math.PI * -0.15, 0, Math.PI * 2);
          ctx.fill();
          
          // Left Eye
          ctx.beginPath();
          ctx.ellipse(-rad * 0.5, -rad * 0.2, rad * 0.4, rad * 0.15 * eyeBlink, Math.PI * 0.15, 0, Math.PI * 2);
          ctx.fill();
          
          // Feline V-shaped snarl / grill
          ctx.strokeStyle = phaseColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-rad * 0.3, rad * 0.4);
          ctx.lineTo(0, rad * 0.6);
          ctx.lineTo(rad * 0.3, rad * 0.4);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(-rad * 0.2, rad * 0.6);
          ctx.lineTo(0, rad * 0.8);
          ctx.lineTo(rad * 0.2, rad * 0.6);
          ctx.stroke();
          
          ctx.restore();

          // Internal Central Overload Reactor (Glows intensely when overheated)
          const cPulse = (Math.sin(now * 0.02) + 1) / 2;
          ctx.fillStyle = isOverheated ? '#ffffff' : phaseColor;
          ctx.shadowBlur = isOverheated ? (100 + cPulse * 50) : (40 + cPulse * 20);
          ctx.beginPath();
          ctx.arc(0, rad * 0.1, rad * 0.2, 0, Math.PI * 2);
          ctx.fill();

          // If firing sweep laser, render massive central beam charge
          if (ufo.bossState === 'sweep') {
             ctx.fillStyle = '#ff0055';
             ctx.shadowBlur = 100;
             ctx.shadowColor = '#ff0055';
             ctx.beginPath();
             ctx.arc(0, rad * 0.1, rad * 0.4 + Math.random() * rad * 0.2, 0, Math.PI * 2);
             ctx.fill();
          }`;

const replacementHull = `          // TRON Biomechanic Mainframe Core
          const hullGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, rad);
          hullGrad.addColorStop(0, '#020108');
          hullGrad.addColorStop(0.6, '#080515');
          hullGrad.addColorStop(1, '#000000');

          ctx.fillStyle = hullGrad;
          ctx.strokeStyle = phaseColor;
          ctx.lineWidth = ufo.bossPhase === 2 ? 6 : 4;
          ctx.shadowBlur = isOverheated ? 45 : ufo.bossPhase === 2 ? 40 : 25;
          ctx.shadowColor = phaseColor;
          
          // Angular TRON disk hull
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

          // Biomechanic organic core
          const cPulse = (Math.sin(now * (isOverheated ? 0.05 : 0.015)) + 1) / 2;
          
          ctx.fillStyle = isOverheated ? '#ffffff' : (ufo.bossPhase === 2 ? '#ffaa00' : '#ff0055');
          ctx.shadowBlur = isOverheated ? (100 + cPulse * 50) : (40 + cPulse * 20);
          ctx.shadowColor = ctx.fillStyle;
          
          // Throbbing core shape
          ctx.beginPath();
          ctx.ellipse(0, 0, rad * 0.3 + cPulse * rad * 0.1, rad * 0.3 + cPulse * rad * 0.1, now * 0.002, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#050510';
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.ellipse(0, 0, rad * 0.1, rad * 0.25, now * 0.002, 0, Math.PI * 2);
          ctx.fill();

          // If firing sweep laser, render massive central beam charge
          if (ufo.bossState === 'sweep') {
             ctx.fillStyle = '#00ffff';
             ctx.shadowBlur = 100;
             ctx.shadowColor = '#00ffff';
             ctx.beginPath();
             ctx.arc(0, 0, rad * 0.4 + Math.random() * rad * 0.2, 0, Math.PI * 2);
             ctx.fill();
          }`;

if (code.includes('ctx.lineTo(-rad * 1.05, -rad * 0.9);')) {
  // Use a regex to replace the entire block more reliably
  // Or just find start and end
  const startIdx = code.indexOf('          // AI Mainframe Core / Corrupted Robot Head Hull');
  const endIdx = code.indexOf('          if (ufo.bossState === \'sweep\') {') + code.substring(code.indexOf('          if (ufo.bossState === \'sweep\') {')).indexOf('          }') + 11;
  
  if (startIdx !== -1 && endIdx !== -1) {
     const blockToReplace = code.substring(startIdx, endIdx);
     code = code.replace(blockToReplace, replacementHull);
     fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
     console.log('Dreadnought patched via substring.');
  } else {
     console.log('Could not find bounds');
  }
} else {
  console.log('Dreadnought target not found!');
}
