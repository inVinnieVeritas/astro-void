const fs = require('fs');
let code = fs.readFileSync('src/components/TouchControls.tsx', 'utf8');

// Remove global touch end/cancel handlers
const touchCancelHandlerRegex = /\s*const handleGlobalTouchEndCancel = \(e: TouchEvent\) => \{\s*resetJoystickInput\(\);\s*\};\s*/g;
code = code.replace(touchCancelHandlerRegex, '');

code = code.replace(/\s*window\.addEventListener\('touchend', handleGlobalTouchEndCancel, true\);\s*/g, '');
code = code.replace(/\s*window\.addEventListener\('touchcancel', handleGlobalTouchEndCancel, true\);\s*/g, '');

code = code.replace(/\s*window\.removeEventListener\('touchend', handleGlobalTouchEndCancel, true\);\s*/g, '');
code = code.replace(/\s*window\.removeEventListener\('touchcancel', handleGlobalTouchEndCancel, true\);\s*/g, '');

// Remove JSX touch handlers
code = code.replace(/\s*onTouchEnd=\{resetJoystickInput\}\s*/g, '');
code = code.replace(/\s*onTouchCancel=\{resetJoystickInput\}\s*/g, '');

fs.writeFileSync('src/components/TouchControls.tsx', code);
