const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetEye2 = `          // Inner Sclera
          ctx.fillStyle = isVulnerable ? \`rgba(255, 255, 255, \${0.8 + eyePulse*0.2})\` : \`rgba(0, 255, 255, \${0.7 + eyePulse*0.3})\`;
          ctx.shadowBlur = isVulnerable ? 50 : 25;
          ctx.shadowColor = accentColor;
          ctx.beginPath();
          ctx.moveTo(-eyeRad * 0.8, 0);
          ctx.quadraticCurveTo(0, -eyeRad * 0.6, eyeRad * 0.8, 0);
          ctx.quadraticCurveTo(0, eyeRad * 0.6, -eyeRad * 0.8, 0);
          ctx.closePath();
          ctx.fill();

          // Determine Look Direction
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

const replacementEye2 = `          // Eyelid mask for the realistic eyeball
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(-eyeRad * 0.85, 0);
          ctx.quadraticCurveTo(0, -eyeRad * 0.7, eyeRad * 0.85, 0);
          ctx.quadraticCurveTo(0, eyeRad * 0.7, -eyeRad * 0.85, 0);
          ctx.closePath();
          ctx.clip(); // Mask the eyeball so it stays within the lids

          // Sclera (Eyeball base)
          const scleraGrad = ctx.createRadialGradient(0, 0, eyeRad * 0.2, 0, 0, eyeRad);
          scleraGrad.addColorStop(0, isVulnerable ? \`rgba(255, 230, 230, \${0.9 + eyePulse*0.1})\` : \`rgba(220, 255, 255, \${0.9 + eyePulse*0.1})\`);
          scleraGrad.addColorStop(1, isVulnerable ? '#880022' : '#004466');
          ctx.fillStyle = scleraGrad;
          ctx.shadowBlur = isVulnerable ? 50 : 25;
          ctx.shadowColor = accentColor;
          ctx.fillRect(-eyeRad, -eyeRad, eyeRad * 2, eyeRad * 2);

          // Extraocular Muscles (Rectus & Oblique visible at the corners)
          // Medial & Lateral Rectus insertions
          ctx.fillStyle = 'rgba(200, 30, 50, 0.7)';
          ctx.beginPath();
          ctx.moveTo(-eyeRad * 0.85, 0);
          ctx.lineTo(-eyeRad * 0.6, -eyeRad * 0.15);
          ctx.lineTo(-eyeRad * 0.5, 0);
          ctx.lineTo(-eyeRad * 0.6, eyeRad * 0.15);
          ctx.fill();
          
          ctx.beginPath();
          ctx.moveTo(eyeRad * 0.85, 0);
          ctx.lineTo(eyeRad * 0.6, -eyeRad * 0.15);
          ctx.lineTo(eyeRad * 0.5, 0);
          ctx.lineTo(eyeRad * 0.6, eyeRad * 0.15);
          ctx.fill();
          
          // Tiny blood vessels growing from corners
          ctx.strokeStyle = 'rgba(200, 20, 20, 0.4)';
          ctx.lineWidth = 1;
          for(let i=0; i<5; i++) {
            ctx.beginPath();
            ctx.moveTo(-eyeRad * 0.6, (Math.random() - 0.5) * eyeRad * 0.2);
            ctx.quadraticCurveTo(-eyeRad * 0.3, (Math.random() - 0.5) * eyeRad * 0.4, 0, (Math.random() - 0.5) * eyeRad * 0.2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(eyeRad * 0.6, (Math.random() - 0.5) * eyeRad * 0.2);
            ctx.quadraticCurveTo(eyeRad * 0.3, (Math.random() - 0.5) * eyeRad * 0.4, 0, (Math.random() - 0.5) * eyeRad * 0.2);
            ctx.stroke();
          }

          // Determine Look Direction (Iris & Pupil positioning)
          let lookX = 0;
          let lookY = 0;
          let pupilRotation = 0;
          let distanceToShip = 0;
          if (ship.alive) {
             const angleToShip = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
             distanceToShip = Math.hypot(ship.x - ufo.x, ship.y - ufo.y);
             // Limit look distance based on eye radius so iris doesn't leave eyeball
             const maxLook = eyeRad * 0.35;
             const distFactor = Math.min(distanceToShip / 600, 1);
             const lookDist = maxLook * distFactor;
             lookX = Math.cos(angleToShip) * lookDist;
             lookY = Math.sin(angleToShip) * lookDist;
             pupilRotation = angleToShip + Math.PI / 2; // Point slit towards player
          }

          // Draw the Iris
          ctx.save();
          ctx.translate(lookX, lookY);
          
          // Perspective squash of the iris when looking to the sides
          const lookDistMag = Math.hypot(lookX, lookY);
          const maxLookMag = eyeRad * 0.35;
          const squash = 1 - (lookDistMag / maxLookMag) * 0.3; // Squash up to 30%
          
          ctx.rotate(pupilRotation); // rotate towards look angle
          ctx.scale(1, squash); // squash in the axis of looking
          // un-rotate so the iris is drawn properly, or keep it rotated if pupil is a slit.
          // Since it's an alien pupil, let's keep it aligned with the look direction!
          
          const irisRad = eyeRad * 0.4;
          
          // Iris background
          const irisColor = isVulnerable ? '#ff5500' : '#00ffff';
          const irisGrad = ctx.createRadialGradient(0, 0, irisRad * 0.2, 0, 0, irisRad);
          irisGrad.addColorStop(0, '#000000'); // pupil edge
          irisGrad.addColorStop(0.2, irisColor);
          irisGrad.addColorStop(0.8, isVulnerable ? '#880000' : '#000088');
          irisGrad.addColorStop(1, '#000000');
          ctx.fillStyle = irisGrad;
          ctx.beginPath();
          ctx.arc(0, 0, irisRad, 0, Math.PI * 2);
          ctx.fill();
          
          // Iris striations (muscle fibers of the iris)
          ctx.strokeStyle = isVulnerable ? 'rgba(255, 200, 0, 0.5)' : 'rgba(200, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          for(let i=0; i<30; i++) {
             const a = (i / 30) * Math.PI * 2;
             const inner = irisRad * 0.3;
             const outer = irisRad * 0.9 + Math.random() * (irisRad * 0.1);
             ctx.beginPath();
             ctx.moveTo(Math.cos(a)*inner, Math.sin(a)*inner);
             ctx.lineTo(Math.cos(a)*outer, Math.sin(a)*outer);
             ctx.stroke();
          }

          // The Slit Pupil (Dilates based on vulnerability and distance)
          ctx.fillStyle = '#000000';
          ctx.shadowBlur = 0;
          ctx.beginPath();
          const pupilWidth = isVulnerable ? eyeRad * 0.15 : eyeRad * 0.05;
          const pupilHeight = isVulnerable ? eyeRad * 0.35 : eyeRad * 0.3;
          ctx.ellipse(0, 0, pupilWidth, pupilHeight, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Corrupted Iris glitch effect
          if (isVulnerable) {
             ctx.strokeStyle = '#ffaa00';
             ctx.lineWidth = 2;
             ctx.beginPath();
             ctx.arc(0, 0, irisRad * 0.8, 0, Math.PI * 2);
             ctx.stroke();
             
             // Random glitch lines across eye
             if (Math.random() < 0.3) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-irisRad * 0.9, (Math.random() - 0.5) * irisRad);
                ctx.lineTo(irisRad * 0.9, (Math.random() - 0.5) * irisRad);
                ctx.stroke();
             }
          }
          
          // Glossy Eye Reflection (Specular Highlight)
          ctx.restore(); // restore translation & scaling for iris to draw reflection fixed to light source
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.ellipse(-eyeRad * 0.2, -eyeRad * 0.25, eyeRad * 0.15, eyeRad * 0.08, -Math.PI/6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(eyeRad * 0.3, eyeRad * 0.2, eyeRad * 0.04, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore(); // Remove Eyelid clipping`;

code = code.replace(targetEye2, replacementEye2);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
