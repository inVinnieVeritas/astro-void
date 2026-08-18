const fs = require('fs');

let code = fs.readFileSync('src/components/TouchControls.tsx', 'utf8');

// 1. Add activeTouchIdRef
code = code.replace(/const activePointerIdRef = useRef<number \| null>\(null\);/g, 
  'const activePointerIdRef = useRef<number | null>(null);\n  const activeTouchIdRef = useRef<number | null>(null);');

// 2. Update resetJoystickInput
code = code.replace(/const resetJoystickInput = useCallback\(\(\) => \{\n\s+activePointerIdRef\.current = null;/g, 
  'const resetJoystickInput = useCallback(() => {\n    activePointerIdRef.current = null;\n    activeTouchIdRef.current = null;');

// 3. Update pointer handlers to ignore pointerType === 'touch'
code = code.replace(/const onPointerDown = \(e: React\.PointerEvent<HTMLDivElement>\) => \{/g, 
  'const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {\n    if (e.pointerType === \'touch\') return;');
code = code.replace(/const onPointerMove = \(e: React\.PointerEvent<HTMLDivElement>\) => \{/g, 
  'const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {\n    if (e.pointerType === \'touch\') return;');
code = code.replace(/const onPointerUpOrCancel = \(e: React\.PointerEvent<HTMLDivElement>\) => \{/g, 
  'const onPointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {\n    if (e.pointerType === \'touch\') return;');
code = code.replace(/const onLostPointerCapture = \(e: React\.PointerEvent<HTMLDivElement>\) => \{/g, 
  'const onLostPointerCapture = (e: React.PointerEvent<HTMLDivElement>) => {\n    if (e.pointerType === \'touch\') return;');

// 4. Add touch handlers
const touchHandlers = `
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPaused || activeTouchIdRef.current !== null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      activeTouchIdRef.current = touch.identifier;
      handlePointerMove(touch.clientX, touch.clientY);
      break;
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPaused || activeTouchIdRef.current === null) return;
    let touchFound = false;
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.identifier === activeTouchIdRef.current) {
        touchFound = true;
        handlePointerMove(touch.clientX, touch.clientY);
        break;
      }
    }
    if (!touchFound) {
      resetJoystickInput();
    }
  };

  const onTouchEndOrCancel = (e: React.TouchEvent<HTMLDivElement>) => {
    if (activeTouchIdRef.current === null) return;
    let ourTouchEnded = false;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchIdRef.current) {
        ourTouchEnded = true;
        break;
      }
    }
    if (ourTouchEnded) {
      resetJoystickInput();
    }
  };
`;

code = code.replace(/const startContinuousFire = \(\) => \{/g, touchHandlers + '\n  const startContinuousFire = () => {');

// 5. Add touch handler bindings to JSX
code = code.replace(/onLostPointerCapture=\{onLostPointerCapture\}/g, 
  'onLostPointerCapture={onLostPointerCapture}\n          onTouchStart={onTouchStart}\n          onTouchMove={onTouchMove}\n          onTouchEnd={onTouchEndOrCancel}\n          onTouchCancel={onTouchEndOrCancel}');

// also the class has 'className={`relative' right after the lost capture. Let's fix that if it got mangled
code = code.replace(/onLostPointerCapture=\{onLostPointerCapture\}className=\{/g, 
  'onLostPointerCapture={onLostPointerCapture}\n          onTouchStart={onTouchStart}\n          onTouchMove={onTouchMove}\n          onTouchEnd={onTouchEndOrCancel}\n          onTouchCancel={onTouchEndOrCancel}\n          className={');

fs.writeFileSync('src/components/TouchControls.tsx', code);
