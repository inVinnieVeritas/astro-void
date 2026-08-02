const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetTriadAI = `            if (ufo.type === 'core_severance') {
              // Core Severance AI
              // Find nodes`;

const replacementTriadAI = `            if (ufo.type === 'triad_core') {
               const triadCores = ufosRef.current.filter(u => u.type === 'triad_core');
               const isLinked = triadCores.length > 1;
               const isBerserk = triadCores.length === 1;

               // Movement
               ufo.behaviorTimer = (ufo.behaviorTimer || 0) + timeFactor;
               const bt = ufo.behaviorTimer;
               
               const w = canvasRef.current?.width || window.innerWidth;
               const h = canvasRef.current?.height || window.innerHeight;
               const sweepX = Math.sin(bt * 0.005) * 300;
               const sweepY = Math.cos(bt * 0.003) * 100;
               const cx = w / 2 + sweepX;
               const cy = Math.max(h * 0.35, 250) + sweepY;

               if (!isBerserk) {
                  // Spin in formation
                  ufo.angle += 0.01 * timeFactor;
                  const triadRadius = triadCores.length === 3 ? 180 : 130;
                  const targetX = cx + Math.cos(ufo.angle) * triadRadius;
                  const targetY = cy + Math.sin(ufo.angle) * triadRadius;
                  ufo.x += (targetX - ufo.x) * 0.05 * timeFactor;
                  ufo.y += (targetY - ufo.y) * 0.05 * timeFactor;
               } else {
                  // Berserk: aggressively follow player, but stay above
                  if (ship.alive) {
                     const targetX = ship.x;
                     const targetY = Math.min(ship.y - 250, h/2);
                     ufo.x += (targetX - ufo.x) * 0.03 * timeFactor;
                     ufo.y += (targetY - ufo.y) * 0.03 * timeFactor;
                  }
               }
               
               // Attack logic
               ufo.shootTimer += timeFactor;
               const shootThreshold = isBerserk ? 30 : 70;
               if (ufo.shootTimer > shootThreshold) {
                  ufo.shootTimer = 0;
                  if (ship.alive) {
                     const angleToShip = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                     if (isBerserk) {
                        // Spread of 3
                        for(let a = -0.3; a <= 0.3; a += 0.3) {
                           ufoBulletsRef.current.push({
                              x: ufo.x, y: ufo.y,
                              vx: Math.cos(angleToShip+a) * 7, vy: Math.sin(angleToShip+a) * 7,
                              angle: angleToShip+a, radius: 6, isLaser: false, color: '#ff0055'
                           });
                        }
                        soundEngine.playSound('laser');
                     } else {
                        // Single aimed shot
                        ufoBulletsRef.current.push({
                           x: ufo.x, y: ufo.y,
                           vx: Math.cos(angleToShip) * 5.5, vy: Math.sin(angleToShip) * 5.5,
                           angle: angleToShip, radius: 6, isLaser: false, color: '#00ffff'
                        });
                        if (triadCores[0] && ufo.id === triadCores[0].id) soundEngine.playSound('laser'); // prevent stacked sounds
                     }
                  }
               }
            }
            
            if (ufo.type === 'core_severance') {
              // Core Severance AI
              // Find nodes`;

if (code.includes(targetTriadAI)) {
  code = code.replace(targetTriadAI, replacementTriadAI);
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
  console.log('Successfully replaced triad AI.');
} else {
  console.log('Triad AI target not found!');
}
