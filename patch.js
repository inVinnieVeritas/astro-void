const fs = require('fs');

let code = fs.readFileSync('src/components/TouchControls.tsx', 'utf8');

code = code.replace(/const resetJoystick = useCallback\(\(\) => \{/g, 'const resetJoystickInput = useCallback(() => {');
code = code.replace(/resetJoystick\(\);/g, 'resetJoystickInput();');
code = code.replace(/, resetJoystick\]\)/g, ', resetJoystickInput])');
code = code.replace(/const handleCustomReset = \(\) => \{\n\s+resetJoystickInput\(\);\n\s+\};\n/g, '');

let listeners = `
    const handleCustomReset = () => {
      resetJoystickInput();
    };

    const handleGlobalTouchEndCancel = (e: TouchEvent) => {
      resetJoystickInput();
    };

    window.addEventListener('pointerup', handleGlobalPointerUpCancel, true);
    window.addEventListener('pointercancel', handleGlobalPointerUpCancel, true);
    window.addEventListener('touchend', handleGlobalTouchEndCancel, true);
    window.addEventListener('touchcancel', handleGlobalTouchEndCancel, true);
    window.addEventListener('blur', handleGlobalBlurHide);
    window.addEventListener('pagehide', handleGlobalBlurHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('asteroids:reset-joystick', handleCustomReset);
`;
let removeListeners = `
      window.removeEventListener('pointerup', handleGlobalPointerUpCancel, true);
      window.removeEventListener('pointercancel', handleGlobalPointerUpCancel, true);
      window.removeEventListener('touchend', handleGlobalTouchEndCancel, true);
      window.removeEventListener('touchcancel', handleGlobalTouchEndCancel, true);
      window.removeEventListener('blur', handleGlobalBlurHide);
      window.removeEventListener('pagehide', handleGlobalBlurHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('asteroids:reset-joystick', handleCustomReset);
`;

code = code.replace(/window\.addEventListener\('pointerup'[\s\S]*?window\.addEventListener\('asteroids:reset-joystick'[^;]+;/g, listeners);
code = code.replace(/window\.removeEventListener\('pointerup'[\s\S]*?window\.removeEventListener\('asteroids:reset-joystick'[^;]+;/g, removeListeners);

code = code.replace(/onPointerUpOrCancel\}/g, 'onPointerUpOrCancel}\n          onTouchEnd={resetJoystickInput}\n          onTouchCancel={resetJoystickInput}');
code = code.replace(/onLostPointerCapture=\{onLostPointerCapture\}/g, 'onLostPointerCapture={(e) => {\n            onLostPointerCapture(e);\n            resetJoystickInput();\n          }}');
code = code.replace(/e\.currentTarget\.hasPointerCapture\(e\.pointerId\)/g, 'true'); // don't check, just try-catch
code = code.replace(/e\.currentTarget\.releasePointerCapture\(e\.pointerId\);/g, 'try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err) {}');

fs.writeFileSync('src/components/TouchControls.tsx', code);
