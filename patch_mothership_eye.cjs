const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetDiamondEye = `          // Faceted Diamond Eye
          ctx.beginPath();
          ctx.moveTo(0, -eyeRadius * 1.35);
          ctx.lineTo(eyeRadius * 1.1, 0);
          ctx.lineTo(0, eyeRadius * 1.35);
          ctx.lineTo(-eyeRadius * 1.1, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Crosshair / Target Reticle Lines
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ffffff';

          const crossLen = eyeRadius * 1.6;
          ctx.beginPath();
          ctx.moveTo(0, -crossLen);
          ctx.lineTo(0, crossLen);
          ctx.moveTo(-crossLen, 0);
          ctx.lineTo(crossLen, 0);
          ctx.stroke();

          // Bright Core Pupil Node
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 2.8 * eyePulse, 0, Math.PI * 2);
          ctx.fill();`;

const replacementDiamondEye = `          if (isMothership) {
             // Mothership Realistic Cat/Reptile Eye
             const mEyeRad = ufo.radius * 0.5;
             ctx.save();
             // Mask
             ctx.beginPath();
             ctx.moveTo(-mEyeRad * 0.85, 0);
             ctx.quadraticCurveTo(0, -mEyeRad * 0.7, mEyeRad * 0.85, 0);
             ctx.quadraticCurveTo(0, mEyeRad * 0.7, -mEyeRad * 0.85, 0);
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

             // Look direction
             let lookX = 0;
             let lookY = 0;
             let pupilRot = 0;
             if (ship.alive) {
                 const ang = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                 const distFact = Math.min(Math.hypot(ship.x - ufo.x, ship.y - ufo.y) / 600, 1);
                 const maxL = mEyeRad * 0.35;
                 lookX = Math.cos(ang) * maxL * distFact;
                 lookY = Math.sin(ang) * maxL * distFact;
                 pupilRot = ang + Math.PI / 2;
             }
             
             ctx.translate(lookX, lookY);
             ctx.rotate(pupilRot);
             const lookMag = Math.hypot(lookX, lookY);
             ctx.scale(1, 1 - (lookMag / (mEyeRad * 0.35)) * 0.3);

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

             // Pupil
             ctx.fillStyle = '#000000';
             ctx.shadowBlur = 0;
             ctx.beginPath();
             ctx.ellipse(0, 0, mEyeRad * 0.08, mEyeRad * 0.3, 0, 0, Math.PI*2);
             ctx.fill();
             
             // Eye reflection
             ctx.restore();
             ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
             ctx.beginPath();
             ctx.ellipse(-mEyeRad * 0.2, -mEyeRad * 0.2, mEyeRad * 0.1, mEyeRad * 0.05, -Math.PI/6, 0, Math.PI*2);
             ctx.fill();
             
             // Outer eyelid rim
             ctx.strokeStyle = '#d946ef';
             ctx.lineWidth = 3;
             ctx.shadowBlur = 20;
             ctx.beginPath();
             ctx.moveTo(-mEyeRad * 0.85, 0);
             ctx.quadraticCurveTo(0, -mEyeRad * 0.7, mEyeRad * 0.85, 0);
             ctx.quadraticCurveTo(0, mEyeRad * 0.7, -mEyeRad * 0.85, 0);
             ctx.closePath();
             ctx.stroke();
          } else {
            // Faceted Diamond Eye
            ctx.beginPath();
            ctx.moveTo(0, -eyeRadius * 1.35);
            ctx.lineTo(eyeRadius * 1.1, 0);
            ctx.lineTo(0, eyeRadius * 1.35);
            ctx.lineTo(-eyeRadius * 1.1, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Crosshair / Target Reticle Lines
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffffff';

            const crossLen = eyeRadius * 1.6;
            ctx.beginPath();
            ctx.moveTo(0, -crossLen);
            ctx.lineTo(0, crossLen);
            ctx.moveTo(-crossLen, 0);
            ctx.lineTo(crossLen, 0);
            ctx.stroke();

            // Bright Core Pupil Node
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 2.8 * eyePulse, 0, Math.PI * 2);
            ctx.fill();
          }`;

code = code.replace(targetDiamondEye, replacementDiamondEye);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
