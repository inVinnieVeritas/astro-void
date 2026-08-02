const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetLvl5Eye = `          if (isMothership) {
             // Mothership Realistic Cat/Reptile Eye (Bigger & Follows perfectly)
             const mEyeRad = ufo.radius * 0.9; // Made it huge!
             ctx.save();
             
             // Determine Look Direction FIRST so we can rotate the entire EYE LID to look at the player!
             let angleToShip = 0;
             if (ship.alive) {
                 angleToShip = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
             }
             
             // If they meant the entire eye opening should rotate and follow the spaceship:
             ctx.rotate(angleToShip); // Rotate the whole eyelid structure to point at the player

             // Mask for the eye opening
             ctx.beginPath();
             ctx.moveTo(mEyeRad * 0.2, -mEyeRad * 0.85); // We rotate 90 deg so the eye is looking 'forward' (right side)
             ctx.quadraticCurveTo(mEyeRad * 0.8, 0, mEyeRad * 0.2, mEyeRad * 0.85); // front lid
             ctx.quadraticCurveTo(-mEyeRad * 0.2, 0, mEyeRad * 0.2, -mEyeRad * 0.85); // back lid
             ctx.closePath();
             ctx.clip();
             
             // Sclera
             const scleraGrad = ctx.createRadialGradient(0, 0, mEyeRad * 0.2, 0, 0, mEyeRad);
             scleraGrad.addColorStop(0, '#ffe0e0');
             scleraGrad.addColorStop(1, '#880000');
             ctx.fillStyle = scleraGrad;
             ctx.shadowBlur = 20;
             ctx.shadowColor = '#d946ef';
             ctx.fillRect(-mEyeRad, -mEyeRad, mEyeRad*2, mEyeRad*2);

             // Draw Iris & Pupil (Look direction is just straight right (x-axis) since we rotated the whole eye!)
             ctx.save();
             // We can translate the pupil slightly forward for parallax
             ctx.translate(mEyeRad * 0.15, 0);
             
             // Iris
             const irisRad = mEyeRad * 0.45;
             const irisGrad = ctx.createRadialGradient(0,0, irisRad * 0.1, 0,0, irisRad);
             irisGrad.addColorStop(0, '#000000');
             irisGrad.addColorStop(0.2, '#d946ef');
             irisGrad.addColorStop(0.8, '#4c1d95');
             irisGrad.addColorStop(1, '#000000');
             ctx.fillStyle = irisGrad;
             ctx.beginPath();
             ctx.arc(0, 0, irisRad, 0, Math.PI*2);
             ctx.fill();
             
             // Iris striations
             ctx.strokeStyle = 'rgba(255, 150, 255, 0.4)';
             ctx.lineWidth = 1;
             for (let i = 0; i < 20; i++) {
                const a = (i / 20) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * irisRad * 0.3, Math.sin(a) * irisRad * 0.3);
                ctx.lineTo(Math.cos(a) * irisRad * 0.9, Math.sin(a) * irisRad * 0.9);
                ctx.stroke();
             }

             // Pupil (Slit is perpendicular to the look direction, so along Y axis)
             ctx.fillStyle = '#000000';
             ctx.shadowBlur = 0;
             ctx.beginPath();
             ctx.ellipse(0, 0, mEyeRad * 0.1, mEyeRad * 0.35, 0, 0, Math.PI*2);
             ctx.fill();
             
             ctx.restore();
             
             // Eye reflection (static relative to the world, so we undo the rotation)
             ctx.save();
             ctx.rotate(-angleToShip);
             ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
             ctx.beginPath();
             ctx.ellipse(-mEyeRad * 0.2, -mEyeRad * 0.2, mEyeRad * 0.1, mEyeRad * 0.05, -Math.PI/6, 0, Math.PI*2);
             ctx.fill();
             ctx.restore();
             
             // Outer eyelid rim
             ctx.strokeStyle = '#d946ef';
             ctx.lineWidth = 4;
             ctx.shadowBlur = 20;
             ctx.beginPath();
             ctx.moveTo(mEyeRad * 0.2, -mEyeRad * 0.85); 
             ctx.quadraticCurveTo(mEyeRad * 0.8, 0, mEyeRad * 0.2, mEyeRad * 0.85); 
             ctx.quadraticCurveTo(-mEyeRad * 0.2, 0, mEyeRad * 0.2, -mEyeRad * 0.85); 
             ctx.closePath();
             ctx.stroke();
             
             ctx.restore(); // Restore from eye rotation/masking
          } else {`;

const replacementLvl5Eye = `          if (isMothership) {
             // Mothership Realistic Cat/Reptile Eyes (Like level 10)
             // The hexagon has vertices at 0, 60, 120, 180, 240, 300 degrees.
             // We will put 3 eyes on it: One central, two on the sides.
             const eyeSize = ufo.radius * 0.45;
             const eyes = [
               { x: 0, y: 0, size: eyeSize * 1.2 }, // Center big eye
               { x: -ufo.radius * 0.5, y: ufo.radius * 0.3, size: eyeSize * 0.6 }, // Bottom left
               { x: ufo.radius * 0.5, y: ufo.radius * 0.3, size: eyeSize * 0.6 } // Bottom right
             ];

             eyes.forEach(eyePos => {
                 const mEyeRad = eyePos.size;
                 ctx.save();
                 ctx.translate(eyePos.x, eyePos.y);

                 // Mask (Eyelids horizontal like lvl 10)
                 ctx.beginPath();
                 ctx.moveTo(-mEyeRad * 0.85, 0);
                 ctx.quadraticCurveTo(0, -mEyeRad * 0.7, mEyeRad * 0.85, 0);
                 ctx.quadraticCurveTo(0, mEyeRad * 0.7, -mEyeRad * 0.85, 0);
                 ctx.closePath();
                 ctx.clip(); // Mask the eyeball
                 
                 // Sclera
                 const scleraGrad = ctx.createRadialGradient(0, 0, mEyeRad * 0.2, 0, 0, mEyeRad);
                 scleraGrad.addColorStop(0, '#ffe0e0');
                 scleraGrad.addColorStop(1, '#880000');
                 ctx.fillStyle = scleraGrad;
                 ctx.shadowBlur = 20;
                 ctx.shadowColor = '#d946ef';
                 ctx.fillRect(-mEyeRad, -mEyeRad, mEyeRad*2, mEyeRad*2);

                 // Determine Look Direction (Iris & Pupil positioning)
                 let lookX = 0;
                 let lookY = 0;
                 let pupilRotation = 0;
                 if (ship.alive) {
                     // Get the absolute world position of this eye
                     const eyeWorldX = ufo.x + eyePos.x;
                     const eyeWorldY = ufo.y + eyePos.y;
                     const angleToShip = Math.atan2(ship.y - eyeWorldY, ship.x - eyeWorldX);
                     const distanceToShip = Math.hypot(ship.x - eyeWorldX, ship.y - eyeWorldY);
                     
                     const maxLook = mEyeRad * 0.35;
                     const distFactor = Math.min(distanceToShip / 600, 1);
                     const lookDist = maxLook * distFactor;
                     lookX = Math.cos(angleToShip) * lookDist;
                     lookY = Math.sin(angleToShip) * lookDist;
                     pupilRotation = angleToShip + Math.PI / 2; // Point slit towards player
                 }
                 
                 // Draw the Iris
                 ctx.save();
                 ctx.translate(lookX, lookY);
                 
                 // Perspective squash
                 const lookDistMag = Math.hypot(lookX, lookY);
                 const squash = 1 - (lookDistMag / (mEyeRad * 0.35)) * 0.3;
                 
                 ctx.rotate(pupilRotation);
                 ctx.scale(1, squash);
                 
                 const irisRad = mEyeRad * 0.45;
                 const irisGrad = ctx.createRadialGradient(0,0, irisRad * 0.1, 0,0, irisRad);
                 irisGrad.addColorStop(0, '#000000');
                 irisGrad.addColorStop(0.2, '#d946ef');
                 irisGrad.addColorStop(0.8, '#4c1d95');
                 irisGrad.addColorStop(1, '#000000');
                 ctx.fillStyle = irisGrad;
                 ctx.beginPath();
                 ctx.arc(0, 0, irisRad, 0, Math.PI*2);
                 ctx.fill();
                 
                 // Iris striations
                 ctx.strokeStyle = 'rgba(255, 150, 255, 0.4)';
                 ctx.lineWidth = 1;
                 for (let i = 0; i < 20; i++) {
                    const a = (i / 20) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(a) * irisRad * 0.3, Math.sin(a) * irisRad * 0.3);
                    ctx.lineTo(Math.cos(a) * irisRad * 0.9, Math.sin(a) * irisRad * 0.9);
                    ctx.stroke();
                 }

                 // Pupil (Vertical slit)
                 ctx.fillStyle = '#000000';
                 ctx.shadowBlur = 0;
                 ctx.beginPath();
                 ctx.ellipse(0, 0, mEyeRad * 0.08, mEyeRad * 0.3, 0, 0, Math.PI*2);
                 ctx.fill();
                 
                 ctx.restore();
                 
                 // Eye reflection (static)
                 ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                 ctx.beginPath();
                 ctx.ellipse(-mEyeRad * 0.2, -mEyeRad * 0.25, mEyeRad * 0.1, mEyeRad * 0.05, -Math.PI/6, 0, Math.PI*2);
                 ctx.fill();
                 
                 ctx.restore(); // end mask
                 
                 // Outer eyelid rim
                 ctx.strokeStyle = '#d946ef';
                 ctx.lineWidth = 3;
                 ctx.shadowBlur = 10;
                 ctx.beginPath();
                 ctx.moveTo(-mEyeRad * 0.85, 0);
                 ctx.quadraticCurveTo(0, -mEyeRad * 0.7, mEyeRad * 0.85, 0);
                 ctx.quadraticCurveTo(0, mEyeRad * 0.7, -mEyeRad * 0.85, 0);
                 ctx.closePath();
                 ctx.stroke();
             });
          } else {`;

code = code.replace(targetLvl5Eye, replacementLvl5Eye);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
