const fs = require('fs');

let code = fs.readFileSync('src/components/TouchControls.tsx', 'utf8');

code = code.replace(/const resetJoystick = useCallback\(\(\) => \{/g, 'const resetJoystickInput = useCallback(() => {');
code = code.replace(/resetJoystick\(\);/g, 'resetJoystickInput();');
code = code.replace(/, resetJoystick\]\)/g, ', resetJoystickInput])');
code = code.replace(/resetJoystick, /g, 'resetJoystickInput, ');

// Handle releasePointerCapture
code = code.replace(/if \(e\.currentTarget\.hasPointerCapture\(e\.pointerId\)\) \{[\s\n]*e\.currentTarget\.releasePointerCapture\(e\.pointerId\);[\s\n]*\}/g, 
  'try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err) {}');

let customResetSearch = `    const handleCustomReset = () => {
      resetJoystickInput();
    };

    window.addEventListener('pointerup', handleGlobalPointerUpCancel, true);
    window.addEventListener('pointercancel', handleGlobalPointerUpCancel, true);
    window.addEventListener('blur', handleGlobalBlurHide);
    window.addEventListener('pagehide', handleGlobalBlurHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('asteroids:reset-joystick', handleCustomReset);`;

let listeners = `    const handleCustomReset = () => {
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
    window.addEventListener('asteroids:reset-joystick', handleCustomReset);`;

code = code.replace(customResetSearch, listeners);

let removeSearch = `      window.removeEventListener('pointerup', handleGlobalPointerUpCancel, true);
      window.removeEventListener('pointercancel', handleGlobalPointerUpCancel, true);
      window.removeEventListener('blur', handleGlobalBlurHide);
      window.removeEventListener('pagehide', handleGlobalBlurHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('asteroids:reset-joystick', handleCustomReset);`;

let removeListeners = `      window.removeEventListener('pointerup', handleGlobalPointerUpCancel, true);
      window.removeEventListener('pointercancel', handleGlobalPointerUpCancel, true);
      window.removeEventListener('touchend', handleGlobalTouchEndCancel, true);
      window.removeEventListener('touchcancel', handleGlobalTouchEndCancel, true);
      window.removeEventListener('blur', handleGlobalBlurHide);
      window.removeEventListener('pagehide', handleGlobalBlurHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('asteroids:reset-joystick', handleCustomReset);`;

code = code.replace(removeSearch, removeListeners);

code = code.replace(/onLostPointerCapture=\{onLostPointerCapture\}/g, 
'onLostPointerCapture={onLostPointerCapture}\n          onTouchEnd={resetJoystickInput}\n          onTouchCancel={resetJoystickInput}');

fs.writeFileSync('src/components/TouchControls.tsx', code);
