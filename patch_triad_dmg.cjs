const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetTriadDmg = `            if (ufo.isBoss) {
              if (ufo.type === 'core_severance') {
                const hitRadius = ufo.radius;`;

const replacementTriadDmg = `            if (ufo.isBoss) {
              if (ufo.type === 'triad_core') {
                const hitRadius = ufo.radius;
                if (dist < hitRadius + b.size) {
                   const triadCores = ufosRef.current.filter(u => u.type === 'triad_core');
                   const isLinked = triadCores.length > 1;
                   const isBerserk = triadCores.length === 1;
                   
                   // Damage calculation
                   let dmg = (b.isLaser ? 25 : 10);
                   if (isLinked) {
                      dmg = Math.max(1, Math.floor(dmg * 0.15)); // heavily reduced damage when linked
                   } else if (isBerserk) {
                      dmg = Math.floor(dmg * 1.5); // Takes more damage in berserk mode but is deadlier
                   }
                   
                   ufo.health -= dmg;
                   state.bossDamageDealt += dmg;
                   recordShotHit();
                   createBigExplosion(b.x, b.y, isLinked ? '#00ffff' : '#ff0055');
                   soundEngine.playSound(isLinked ? 'shield_hit' : 'heavy_explode');
                   if (!b.isLaser) bulletsRef.current.splice(i, 1);
                   
                   if (ufo.health <= 0) {
                      destroyUfo(ufo, 5000); // Base points
                      
                      if (triadCores.length === 3) {
                         triggerBigBanner('⚠️ LINK BROKEN', 'DEFENSES WEAKENING!', '#00ffff', 'rgba(0, 255, 255, 0.8)', 90);
                      } else if (triadCores.length === 2) {
                         triggerBigBanner('⚠️ FINAL CORE ISOLATED ⚠️', 'BERSERK MODE ACTIVATED!', '#ff0055', 'rgba(255, 0, 85, 0.9)', 120);
                         soundEngine.playSound('heavy_explode');
                      } else {
                         triggerBigBanner('TRIAD PROTOCOL DESTROYED', 'THREAT NEUTRALIZED', '#38bdf8', 'rgba(56, 189, 248, 0.9)', 180);
                      }
                      
                      // Also spawn a bunch of powerups from the broken core
                      if (Math.random() < 0.5) spawnCollectible(ufo.x, ufo.y, 'laser');
                      spawnCollectible(ufo.x + 20, ufo.y, 'golden');
                      break;
                   } else {
                      if (isLinked) {
                         addFloatingText(ufo.x, ufo.y - 25, \`LINKED! -\${dmg}\`, '#00ffff', 14);
                      } else {
                         addFloatingText(ufo.x, ufo.y - 25, \`-\${dmg} HP\`, '#ff0055', 18);
                      }
                   }
                }
              } else if (ufo.type === 'core_severance') {
                const hitRadius = ufo.radius;`;

if (code.includes(targetTriadDmg)) {
  code = code.replace(targetTriadDmg, replacementTriadDmg);
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
  console.log('Successfully replaced triad damage logic.');
} else {
  console.log('Triad Dmg target not found!');
}
