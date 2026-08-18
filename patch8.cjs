const fs = require('fs');

let code = fs.readFileSync('src/components/TouchControls.tsx', 'utf8');
code = code.replace(/onTouchCancel=\{onTouchEndOrCancel\}className=\{/g, 
  'onTouchCancel={onTouchEndOrCancel}\n          className={');

fs.writeFileSync('src/components/TouchControls.tsx', code);
