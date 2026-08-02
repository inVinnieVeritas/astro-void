const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetCoreSeverance = `        } else if (ufo.type === 'core_severance') {
          // Core Severance Boss Visuals: Corrupted AI Brain
          const rad = ufo.radius;
          const isVulnerable = ufo.bossPhase === 2; // Phase 2 means nodes are dead
          
          const pulseSpeed = isVulnerable ? 0.012 : 0.003;
          const rotateSpeed = isVulnerable ? 0.002 : 0.0005;
          const eyePulse = Math.sin(now * pulseSpeed) * 0.5 + 0.5;
          
          const primaryColor = isVulnerable ? '#ff0055' : '#A371F7';
          const accentColor = isVulnerable ? '#ffaa00' : '#00ffff';

          // Core Aura / Overload Glow
          ctx.shadowBlur = isVulnerable ? 60 + eyePulse * 40 : 30 + eyePulse * 15;
          ctx.shadowColor = primaryColor;
          
          // Background Brain Mass
          ctx.fillStyle = isVulnerable ? \`rgba(30, 5, 10, 0.95)\` : \`rgba(15, 10, 30, 0.95)\`;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 0.95, 0, Math.PI * 2);
          ctx.fill();

          // Neural Pathways / Circuit Lines
          ctx.save();
          ctx.rotate(now * rotateSpeed * 0.5);
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = isVulnerable ? 3 : 1.5;
          ctx.shadowBlur = 10;
          ctx.shadowColor = primaryColor;
          
          // Draw random-looking but deterministic circuits
          for(let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const length = rad * (0.4 + (i % 3) * 0.2);
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * rad * 0.2, Math.sin(angle) * rad * 0.2);
            // Zig zag
            const midX = Math.cos(angle + 0.2) * length * 0.6;
            const midY = Math.sin(angle + 0.2) * length * 0.6;
            ctx.lineTo(midX, midY);
            ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
            ctx.stroke();
            
            // Data nodes at the ends
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * length, Math.sin(angle) * length, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Faceted Crystalline / Geometric Brain Plates
          ctx.save();
          ctx.rotate(-now * rotateSpeed);
          ctx.strokeStyle = isVulnerable ? \`rgba(255, 0, 85, \${0.8 + eyePulse*0.2})\` : \`rgba(163, 113, 247, \${0.5 + eyePulse*0.3})\`;
          ctx.lineWidth = isVulnerable ? 4 : 2;
          
          const plateLayers = 3;
          for(let l = 1; l <= plateLayers; l++) {
            const layerRad = rad * (1.1 - (l * 0.25));
            const points = 6 + l * 2;
            ctx.beginPath();
            for(let i = 0; i < points; i++) {
               const a = (i / points) * Math.PI * 2 + (l * 0.5);
               // Add some jitter to make it look organic/corrupted
               const jitter = isVulnerable ? Math.sin(now * 0.01 + i) * 8 : 0;
               const px = Math.cos(a) * (layerRad + jitter);
               const py = Math.sin(a) * (layerRad + jitter);
               if (i === 0) ctx.moveTo(px, py);
               else ctx.lineTo(px, py);
            }
            ctx.closePath();
            if (l === 1) {
              ctx.fillStyle = isVulnerable ? 'rgba(255, 0, 85, 0.1)' : 'rgba(0, 255, 255, 0.05)';
              ctx.fill();
            }
            ctx.stroke();
          }
          
          // Connective crystalline struts
          ctx.beginPath();
          for(let i=0; i<8; i++) {
             const a = (i/8)*Math.PI*2;
             ctx.moveTo(Math.cos(a)*rad*0.3, Math.sin(a)*rad*0.3);
             ctx.lineTo(Math.cos(a)*rad*0.8, Math.sin(a)*rad*0.8);
          }
          ctx.stroke();
          ctx.restore();

          // Central Pulsing Data Core / "Eye"
          const eyeRad = isVulnerable ? rad * 0.35 + eyePulse * 15 : rad * 0.25 + eyePulse * 5;
            
          ctx.fillStyle = isVulnerable ? \`rgba(255, 255, 255, \${0.8 + eyePulse*0.2})\` : \`rgba(0, 255, 255, \${0.7 + eyePulse*0.3})\`;
          ctx.shadowBlur = isVulnerable ? 50 : 25;
          ctx.shadowColor = accentColor;
          ctx.beginPath();
          
          // Draw diamond/rhombus eye
          ctx.moveTo(0, -eyeRad);
          ctx.lineTo(eyeRad * 0.7, 0);
          ctx.lineTo(0, eyeRad);
          ctx.lineTo(-eyeRad * 0.7, 0);
          ctx.closePath();
          ctx.fill();

          // Pupil / Inner core
          ctx.fillStyle = primaryColor;
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.moveTo(0, -eyeRad * 0.4);
          ctx.lineTo(eyeRad * 0.3, 0);
          ctx.lineTo(0, eyeRad * 0.4);
          ctx.lineTo(-eyeRad * 0.3, 0);
          ctx.closePath();
          ctx.fill();`;

const replacementCoreSeverance = `        } else if (ufo.type === 'core_severance') {
          // --- LEVEL 10 FINAL BOSS: CORE SEVERANCE (BIBLICALLY ACCURATE AI SERAPHIM) ---
          const rad = ufo.radius;
          const isVulnerable = ufo.bossPhase === 2; // Phase 2 means nodes are dead
          
          const pulseSpeed = isVulnerable ? 0.012 : 0.003;
          const rotateSpeed = isVulnerable ? 0.004 : 0.001;
          const eyePulse = Math.sin(now * pulseSpeed) * 0.5 + 0.5;
          const slowRot = now * rotateSpeed;
          
          const primaryColor = isVulnerable ? '#ff0055' : '#A371F7';
          const accentColor = isVulnerable ? '#ffaa00' : '#00ffff';

          ctx.shadowBlur = isVulnerable ? 50 + eyePulse * 40 : 30 + eyePulse * 15;
          ctx.shadowColor = primaryColor;
          
          // Outer Orbiting Runes/Glyphs (Binary/Hex data rings)
          ctx.save();
          ctx.rotate(-slowRot * 0.5);
          ctx.fillStyle = isVulnerable ? \`rgba(255, 0, 85, \${0.4 + eyePulse * 0.4})\` : \`rgba(163, 113, 247, \${0.4 + eyePulse * 0.3})\`;
          ctx.font = \`bold \${rad * 0.15}px monospace\`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const ringRad = rad * 1.4;
          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const px = Math.cos(angle) * ringRad;
            const py = Math.sin(angle) * ringRad;
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillText(Math.random() > 0.5 ? '1' : '0', 0, 0);
            ctx.restore();
          }
          ctx.restore();

          // Outer Gyroscopic Ring 1
          ctx.save();
          ctx.scale(1, 0.4 + Math.sin(now * 0.001) * 0.2);
          ctx.rotate(slowRot * 1.2);
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 1.1, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Outer Gyroscopic Ring 2
          ctx.save();
          ctx.scale(0.4 + Math.cos(now * 0.0013) * 0.2, 1);
          ctx.rotate(-slowRot * 1.5);
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 1.2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // 6 Rotating Monoliths / "Wings"
          ctx.save();
          ctx.rotate(slowRot * 0.8);
          ctx.fillStyle = '#05030f';
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 2.5;
          for (let i = 0; i < 6; i++) {
             ctx.save();
             ctx.rotate((i / 6) * Math.PI * 2);
             // Breathing effect for wings
             const wingDist = isVulnerable ? rad * 0.7 + Math.sin(now * 0.01 + i) * 15 : rad * 0.8;
             ctx.translate(wingDist, 0);
             
             ctx.beginPath();
             ctx.moveTo(0, -rad * 0.1);
             ctx.lineTo(rad * 0.6, 0);
             ctx.lineTo(0, rad * 0.1);
             ctx.lineTo(-rad * 0.1, 0);
             ctx.closePath();
             ctx.fill();
             ctx.stroke();
             
             // Inner wing glow
             ctx.fillStyle = accentColor;
             ctx.beginPath();
             ctx.arc(rad * 0.4, 0, rad * 0.04, 0, Math.PI * 2);
             ctx.fill();
             
             ctx.restore();
          }
          ctx.restore();

          // Central Crystalline Core / "The All-Seeing Eye"
          ctx.save();
          const eyeRad = isVulnerable ? rad * 0.45 + eyePulse * 15 : rad * 0.35 + eyePulse * 5;
          
          // Core background
          ctx.fillStyle = '#0a0a1a';
          ctx.beginPath();
          ctx.moveTo(0, -eyeRad);
          ctx.lineTo(eyeRad * 0.85, 0);
          ctx.lineTo(0, eyeRad);
          ctx.lineTo(-eyeRad * 0.85, 0);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 4;
          ctx.stroke();

          // Inner Sclera
          ctx.fillStyle = isVulnerable ? \`rgba(255, 255, 255, \${0.8 + eyePulse*0.2})\` : \`rgba(0, 255, 255, \${0.7 + eyePulse*0.3})\`;
          ctx.shadowBlur = isVulnerable ? 50 : 25;
          ctx.shadowColor = accentColor;
          ctx.beginPath();
          ctx.moveTo(0, -eyeRad * 0.7);
          ctx.lineTo(eyeRad * 0.6, 0);
          ctx.lineTo(0, eyeRad * 0.7);
          ctx.lineTo(-eyeRad * 0.6, 0);
          ctx.closePath();
          ctx.fill();

          // The Slit Pupil (Staring intensely)
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

code = code.replace(targetCoreSeverance, replacementCoreSeverance);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
