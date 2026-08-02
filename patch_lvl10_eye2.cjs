const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetEye = `          // The Slit Pupil (Staring intensely)
          ctx.fillStyle = '#000000';
          ctx.shadowBlur = 0;
          ctx.beginPath();
          const pupilWidth = isVulnerable ? eyeRad * 0.15 : eyeRad * 0.05;
          ctx.ellipse(0, 0, pupilWidth, eyeRad * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Corrupted Iris glitch effect
          if (isVulnerable) {
             ctx.strokeStyle = '#ffaa00';
             ctx.lineWidth = 2;
             ctx.beginPath();
             ctx.arc(0, 0, eyeRad * 0.4, 0, Math.PI * 2);
             ctx.stroke();
             
             // Random glitch lines across eye
             if (Math.random() < 0.3) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-eyeRad * 0.5, (Math.random() - 0.5) * eyeRad);
                ctx.lineTo(eyeRad * 0.5, (Math.random() - 0.5) * eyeRad);
                ctx.stroke();
             }
          }`;

const replacementEye = `          // Determine Look Direction
          let lookX = 0;
          let lookY = 0;
          let pupilRotation = 0;
          if (ship.alive) {
             const angleToShip = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
             const lookDist = eyeRad * 0.25;
             lookX = Math.cos(angleToShip) * lookDist;
             lookY = Math.sin(angleToShip) * lookDist;
             pupilRotation = angleToShip + Math.PI / 2; // Point slit towards player
          }

          // The Slit Pupil (Staring intensely, tracking player)
          ctx.save();
          ctx.translate(lookX, lookY);
          ctx.rotate(pupilRotation);
          ctx.fillStyle = '#000000';
          ctx.shadowBlur = 0;
          ctx.beginPath();
          const pupilWidth = isVulnerable ? eyeRad * 0.15 : eyeRad * 0.05;
          ctx.ellipse(0, 0, pupilWidth, eyeRad * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Corrupted Iris glitch effect
          if (isVulnerable) {
             ctx.strokeStyle = '#ffaa00';
             ctx.lineWidth = 2;
             ctx.beginPath();
             ctx.arc(0, 0, eyeRad * 0.4, 0, Math.PI * 2);
             ctx.stroke();
             
             // Random glitch lines across eye
             if (Math.random() < 0.3) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-eyeRad * 0.5, (Math.random() - 0.5) * eyeRad);
                ctx.lineTo(eyeRad * 0.5, (Math.random() - 0.5) * eyeRad);
                ctx.stroke();
             }
          }
          ctx.restore();`;

code = code.replace(targetEye, replacementEye);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
