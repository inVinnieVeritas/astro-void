const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetDreadnoughtEyes = `          // Mainframe "Eyes" / Sensor Arrays
          ctx.fillStyle = phaseColor;
          ctx.shadowBlur = 30;
          ctx.shadowColor = phaseColor;
          
          const eyePulse = isOverheated ? Math.random() : (Math.sin(now * 0.01) + 1) / 2;
          ctx.globalAlpha = 0.5 + eyePulse * 0.3;
          
          // Left Eye Sensor (Cat Sclera)
          ctx.beginPath();
          ctx.moveTo(-rad * 0.8, -rad * 0.25); // outer corner
          ctx.lineTo(-rad * 0.4, -rad * 0.4); // top arc
          ctx.lineTo(-rad * 0.2, -rad * 0.1); // inner corner
          ctx.lineTo(-rad * 0.4, -rad * 0.05); // bottom arc
          ctx.closePath();
          ctx.fill();

          // Right Eye Sensor (Cat Sclera)
          ctx.beginPath();
          ctx.moveTo(rad * 0.8, -rad * 0.25);
          ctx.lineTo(rad * 0.4, -rad * 0.4);
          ctx.lineTo(rad * 0.2, -rad * 0.1);
          ctx.lineTo(rad * 0.4, -rad * 0.05);
          ctx.closePath();
          ctx.fill();
          
          // Glowing Slit Pupils (Feline)
          ctx.globalAlpha = 0.9 + eyePulse * 0.1;
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 40;
          ctx.beginPath();
          ctx.ellipse(-rad * 0.45, -rad * 0.2, rad * 0.03, rad * 0.12, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(rad * 0.45, -rad * 0.2, rad * 0.03, rad * 0.12, -0.2, 0, Math.PI * 2);
          ctx.fill();`;

const replacementDreadnoughtEyes = `          // Mainframe "Eyes" / Sensor Arrays
          ctx.fillStyle = phaseColor;
          ctx.shadowBlur = 30;
          ctx.shadowColor = phaseColor;
          
          const eyePulse = isOverheated ? Math.random() : (Math.sin(now * 0.01) + 1) / 2;
          ctx.globalAlpha = 1.0;
          
          // Realistic Tracking Eyes (Left and Right)
          const eyes = [
            { sign: -1, cx: -rad * 0.5, cy: -rad * 0.22, rot: 0.2 }, // Left Eye
            { sign: 1, cx: rad * 0.5, cy: -rad * 0.22, rot: -0.2 }  // Right Eye
          ];
          
          eyes.forEach(eye => {
            const mEyeRad = rad * 0.35;
            ctx.save();
            ctx.translate(eye.cx, eye.cy);
            
            // Determine Look Direction (Iris & Pupil positioning)
            let lookX = 0;
            let lookY = 0;
            let pupilRotation = 0;
            if (ship.alive) {
                // Get the absolute world position of this eye
                const eyeWorldX = ufo.x + eye.cx;
                const eyeWorldY = ufo.y + eye.cy;
                const angleToShip = Math.atan2(ship.y - eyeWorldY, ship.x - eyeWorldX);
                const distanceToShip = Math.hypot(ship.x - eyeWorldX, ship.y - eyeWorldY);
                
                const maxLook = mEyeRad * 0.35;
                const distFactor = Math.min(distanceToShip / 600, 1);
                const lookDist = maxLook * distFactor;
                lookX = Math.cos(angleToShip) * lookDist;
                lookY = Math.sin(angleToShip) * lookDist;
                pupilRotation = angleToShip + Math.PI / 2; // Point slit towards player
            }

            // Tilt the eye slightly to fit the cat face
            ctx.rotate(eye.rot);

            // Eyelid Mask
            ctx.beginPath();
            ctx.moveTo(-mEyeRad * 0.85, 0);
            ctx.quadraticCurveTo(-mEyeRad * 0.1, -mEyeRad * 0.7, mEyeRad * 0.85, 0);
            ctx.quadraticCurveTo(-mEyeRad * 0.1, mEyeRad * 0.7, -mEyeRad * 0.85, 0);
            ctx.closePath();
            ctx.clip(); // Mask the eyeball
            
            // Sclera (Pinkish red for Dreadnought)
            const scleraGrad = ctx.createRadialGradient(0, 0, mEyeRad * 0.2, 0, 0, mEyeRad);
            scleraGrad.addColorStop(0, isOverheated ? '#ffffff' : \`rgba(255, 200, 220, \${0.9 + eyePulse*0.1})\`);
            scleraGrad.addColorStop(1, isOverheated ? '#aaaaaa' : '#880022');
            ctx.fillStyle = scleraGrad;
            ctx.shadowBlur = 20;
            ctx.shadowColor = phaseColor;
            ctx.fillRect(-mEyeRad, -mEyeRad, mEyeRad*2, mEyeRad*2);

            // Draw the Iris
            ctx.save();
            ctx.rotate(-eye.rot); // un-tilt for looking direction
            ctx.translate(lookX, lookY);
            
            // Perspective squash
            const lookDistMag = Math.hypot(lookX, lookY);
            const squash = 1 - (lookDistMag / (mEyeRad * 0.35)) * 0.3;
            
            ctx.rotate(pupilRotation);
            ctx.scale(1, squash);
            
            const irisRad = mEyeRad * 0.55;
            const irisGrad = ctx.createRadialGradient(0,0, irisRad * 0.1, 0,0, irisRad);
            irisGrad.addColorStop(0, '#000000');
            irisGrad.addColorStop(0.2, isOverheated ? '#ffffff' : '#ff0055');
            irisGrad.addColorStop(0.8, isOverheated ? '#aaaaaa' : '#880022');
            irisGrad.addColorStop(1, '#000000');
            ctx.fillStyle = irisGrad;
            ctx.beginPath();
            ctx.arc(0, 0, irisRad, 0, Math.PI*2);
            ctx.fill();
            
            // Iris striations
            ctx.strokeStyle = isOverheated ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 100, 150, 0.4)';
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
            const pupilWidth = isOverheated ? mEyeRad * 0.15 : mEyeRad * 0.08;
            const pupilHeight = isOverheated ? mEyeRad * 0.45 : mEyeRad * 0.35;
            ctx.ellipse(0, 0, pupilWidth, pupilHeight, 0, 0, Math.PI*2);
            ctx.fill();
            
            ctx.restore(); // restore iris translation/rotation
            
            // Eye reflection (static)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.ellipse(-mEyeRad * 0.2, -mEyeRad * 0.25, mEyeRad * 0.1, mEyeRad * 0.05, -Math.PI/6, 0, Math.PI*2);
            ctx.fill();
            
            ctx.restore(); // end mask
            
            // Outer eyelid rim
            ctx.save();
            ctx.translate(eye.cx, eye.cy);
            ctx.rotate(eye.rot);
            ctx.strokeStyle = phaseColor;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(-mEyeRad * 0.85, 0);
            ctx.quadraticCurveTo(-mEyeRad * 0.1, -mEyeRad * 0.7, mEyeRad * 0.85, 0);
            ctx.quadraticCurveTo(-mEyeRad * 0.1, mEyeRad * 0.7, -mEyeRad * 0.85, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          });`;

if (code.includes(targetDreadnoughtEyes)) {
  code = code.replace(targetDreadnoughtEyes, replacementDreadnoughtEyes);
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
  console.log('Successfully replaced dreadnought eyes.');
} else {
  console.log('Target not found!');
  
  // Let's print out the code in that area to see what it is
  const lines = code.split('\n');
  const startIdx = lines.findIndex(l => l.includes('// Mainframe "Eyes" / Sensor Arrays'));
  if (startIdx !== -1) {
    console.log(lines.slice(startIdx, startIdx + 40).join('\n'));
  }
}
