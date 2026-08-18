const fs = require('fs');

let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

// 1. Extra Life Algorithm
code = code.replace(/if \(!state\.nextExtraLifeScore\) \{\n\s+state\.nextExtraLifeScore = 100000;\n\s+\}/,
  `if (!state.nextExtraLifeScore) {
      state.nextExtraLifeScore = 100000;
      state.extraLifeIncrement = 100000;
    }`);

code = code.replace(/state\.nextExtraLifeScore \+= 100000;/g,
  `state.extraLifeIncrement = (state.extraLifeIncrement || 100000) + 100000;
        state.nextExtraLifeScore += state.extraLifeIncrement;`);
        
// Fix initial state definition for extraLifeIncrement
code = code.replace(/nextExtraLifeScore: 100000,/g,
  `nextExtraLifeScore: 100000,
    extraLifeIncrement: 100000,`);

// 2. Shield Ram Cost
const shieldRamMatch = code.match(/if \(isShielded\) \{\n\s+\/\/ Ramming asteroid with shield destroys & splits it as if shot\n\s+destroyAsteroid\(i, true\);\n\s+\}/);
if (shieldRamMatch) {
  const replacement = `if (isShielded) {
                if (pTimers.shield > 0) pTimers.shield = Math.max(0, pTimers.shield - 180);
                if (pTimers.golden > 0) {
                  pTimers.golden = Math.max(0, pTimers.golden - 180);
                  pTimers.tripleShot = Math.max(0, pTimers.tripleShot - 180);
                }
                // Ramming asteroid with shield destroys & splits it as if shot
                destroyAsteroid(i, true);
              }`;
  code = code.replace(shieldRamMatch[0], replacement);
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
  console.log("Shield ram and extra life patched.");
} else {
  console.log("Shield ram match failed.");
}

