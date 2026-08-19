const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const targetRef = "  const dropsThisFrameRef = useRef(0);";
const replaceRef = targetRef + "\n  const frameCountRef = useRef(0);";
code = code.replace(targetRef, replaceRef);

const targetLoop = "    const updateAndRender = () => {\n      const now = performance.now();";
const replaceLoop = "    const updateAndRender = () => {\n      frameCountRef.current++;\n      const now = performance.now();";
code = code.replace(targetLoop, replaceLoop);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
