const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('isTouchDevice, setIsTouchDevice')) {
  code = code.replace(
    /const \[gameMode, setGameMode\] = useState<GameMode>\('classic'\);/,
    "const [gameMode, setGameMode] = useState<GameMode>('classic');\n  const [isTouchDevice, setIsTouchDevice] = useState(false);\n\n  useEffect(() => {\n    const checkTouch = () => setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);\n    checkTouch();\n    window.addEventListener('resize', checkTouch);\n    return () => window.removeEventListener('resize', checkTouch);\n  }, []);"
  );
  
  code = code.replace(
    /<AsteroidsCanvas/g,
    "<AsteroidsCanvas\n        isTouchDevice={isTouchDevice}"
  );
  
  code = code.replace(
    /{?\/\* Mobile\/Tablet Touch Controls \*\/}?/,
    "{isTouchDevice && (\n      <>\n      {/* Mobile/Tablet Touch Controls */}"
  );
  
  code = code.replace(
    /empCount={empCount}\n        hyperspaceReady={hyperspaceCooldown <= 0}\n      \/>/g,
    "empCount={empCount}\n        hyperspaceReady={hyperspaceCooldown <= 0}\n      />\n      </>\n      )}"
  );

  fs.writeFileSync('src/App.tsx', code);
  console.log("App.tsx patched successfully");
} else {
  console.log("Already patched");
}
