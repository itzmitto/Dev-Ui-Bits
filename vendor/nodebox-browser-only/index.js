// Original DevUI Bits adapter, MIT. Contains no Nodebox implementation or source.
// Sandpack's React browser runtime never calls this API. Fail explicitly if a
// developer tries to enable a Node.js sandbox without installing its runtime.
export const INJECT_MESSAGE_TYPE = 'devui-node-runtime-disabled';
export const PREVIEW_LOADED_MESSAGE_TYPE = 'devui-node-preview-disabled';
export class Nodebox {
  constructor() {
    throw new Error('DevUI Bits supports browser React sandboxes. Node.js sandbox templates are not enabled.');
  }
}
