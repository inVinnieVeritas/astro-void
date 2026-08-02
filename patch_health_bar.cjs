const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetHealthBar = `      // 13. Dedicated Boss Health Bar UI
      const activeBoss = ufosRef.current.find((u) => u.isBoss);
      if (activeBoss) {
        ctx.save();
        const barW = Math.min(480, width * 0.65);
        const barH = 14;
        const barX = (width - barW) / 2;
        const barY = 32;

        let bossBarAlpha = 1;
        const ship = shipRef.current;
        if (ship && ship.alive) {
           const distY = Math.abs(ship.y - barY);
           if (distY < 80) {
              bossBarAlpha = Math.max(0.15, distY / 80);
           }
        }
        ctx.globalAlpha = bossBarAlpha;

        const isOverheated = activeBoss.bossState === 'cooldown';

        // Container Panel Frame
        ctx.fillStyle = 'rgba(6, 9, 20, 0.94)';
        ctx.beginPath();
        ctx.roundRect(barX - 16, barY - 22, barW + 32, barH + 48, 10);
        ctx.fill();

        ctx.strokeStyle = isOverheated ? '#ffffff' : activeBoss.bossPhase === 2 ? 'rgba(255, 0, 85, 0.95)' : 'rgba(225, 29, 72, 0.8)';
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = isOverheated ? 20 : 15;
        ctx.shadowColor = isOverheated ? '#ffffff' : '#ff0055';
        ctx.stroke();

        // Boss Title
        ctx.font = 'bold 12px font-mono, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isOverheated ? '#ffffff' : '#ff0055';
        ctx.shadowBlur = 12;
        ctx.shadowColor = isOverheated ? '#ffffff' : '#ff0055';
        const phaseLabel = activeBoss.bossPhase === 2 ? 'PHASE 2 - OVERDRIVE' : 'PHASE 1 - TACTICAL';
        ctx.fillText(\`⚠️ DREADNOUGHT MOTHERSHIP (\${phaseLabel}) ⚠️\`, width / 2, barY - 10);

        // Bar Background
        ctx.fillStyle = 'rgba(20, 5, 12, 0.95)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        // Fill Level Gradient
        const hpRatio = Math.max(0, activeBoss.health / activeBoss.maxHealth);`;

const replacementHealthBar = `      // 13. Dedicated Boss Health Bar UI
      const triadCores = ufosRef.current.filter(u => u.type === 'triad_core');
      const activeBoss = triadCores.length > 0 ? triadCores[0] : ufosRef.current.find((u) => u.isBoss);
      if (activeBoss) {
        ctx.save();
        const barW = Math.min(480, width * 0.65);
        const barH = 14;
        const barX = (width - barW) / 2;
        const barY = 32;

        let bossBarAlpha = 1;
        const ship = shipRef.current;
        if (ship && ship.alive) {
           const distY = Math.abs(ship.y - barY);
           if (distY < 80) {
              bossBarAlpha = Math.max(0.15, distY / 80);
           }
        }
        ctx.globalAlpha = bossBarAlpha;

        const isTriad = triadCores.length > 0;
        let totalHealth = activeBoss.health;
        let totalMaxHealth = activeBoss.maxHealth;
        let bossTitle = '';
        let titleColor = '#ff0055';
        let barColor = 'rgba(225, 29, 72, 0.8)';
        let isOverheated = false;

        if (isTriad) {
           totalHealth = triadCores.reduce((sum, c) => sum + c.health, 0);
           totalMaxHealth = triadCores.reduce((sum, c) => sum + (c.maxHealth || 1), 0);
           const phaseText = triadCores.length === 1 ? 'FINAL CORE BERSERK' : \`\${triadCores.length} CORES ACTIVE\`;
           bossTitle = \`⚠️ TRIAD PROTOCOL (\${phaseText}) ⚠️\`;
           titleColor = triadCores.length === 1 ? '#ff0055' : '#00ffff';
           barColor = triadCores.length === 1 ? 'rgba(255, 0, 85, 0.9)' : 'rgba(0, 255, 255, 0.8)';
        } else {
           isOverheated = activeBoss.bossState === 'cooldown';
           const phaseLabel = activeBoss.bossPhase === 2 ? 'PHASE 2 - OVERDRIVE' : 'PHASE 1 - TACTICAL';
           const name = activeBoss.type === 'core_severance' ? 'CORE SEVERANCE MAINFRAME' : 'DREADNOUGHT MOTHERSHIP';
           bossTitle = \`⚠️ \${name} (\${phaseLabel}) ⚠️\`;
           if (isOverheated) {
              titleColor = '#ffffff';
              barColor = '#ffffff';
           } else if (activeBoss.bossPhase === 2) {
              titleColor = activeBoss.type === 'core_severance' ? '#ff0055' : '#ff0055';
              barColor = 'rgba(255, 0, 85, 0.95)';
           } else {
              titleColor = activeBoss.type === 'core_severance' ? '#A371F7' : '#ff0055';
              barColor = activeBoss.type === 'core_severance' ? 'rgba(163, 113, 247, 0.9)' : 'rgba(225, 29, 72, 0.8)';
           }
        }

        // Container Panel Frame
        ctx.fillStyle = 'rgba(6, 9, 20, 0.94)';
        ctx.beginPath();
        ctx.roundRect(barX - 16, barY - 22, barW + 32, barH + 48, 10);
        ctx.fill();

        ctx.strokeStyle = barColor;
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = isOverheated ? 20 : 15;
        ctx.shadowColor = titleColor;
        ctx.stroke();

        // Boss Title
        ctx.font = 'bold 12px font-mono, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = titleColor;
        ctx.shadowBlur = 12;
        ctx.shadowColor = titleColor;
        ctx.fillText(bossTitle, width / 2, barY - 10);

        // Bar Background
        ctx.fillStyle = 'rgba(20, 5, 12, 0.95)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        // Fill Level Gradient
        const hpRatio = Math.max(0, totalHealth / totalMaxHealth);`;

if (code.includes(targetHealthBar)) {
  code = code.replace(targetHealthBar, replacementHealthBar);
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
  console.log('Successfully replaced boss health bar logic.');
} else {
  console.log('Boss health bar target not found!');
  const lines = code.split('\n');
  const startIdx = lines.findIndex(l => l.includes('// 13. Dedicated Boss Health Bar UI'));
  if (startIdx !== -1) {
    console.log(lines.slice(startIdx, startIdx + 30).join('\n'));
  }
}
