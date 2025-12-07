import { BlockerEngine } from '../../../src/content/core/blocker-engine.js';

describe('BlockerEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new BlockerEngine();
    document.head.innerHTML = '';
  });

  test('injectCss adds style tag to head', () => {
    engine.injectCss('test-id', '.test { display: none; }');
    
    const style = document.getElementById('test-id');
    expect(style).not.toBeNull();
    expect(style.textContent).toBe('.test { display: none; }');
  });

  test('injectCss does not duplicate style tags', () => {
    engine.injectCss('test-id', 'css1');
    engine.injectCss('test-id', 'css2');
    
    const styles = document.querySelectorAll('#test-id');
    expect(styles.length).toBe(1);
    expect(styles[0].textContent).toBe('css1');
  });

  test('removeCss removes style tag', () => {
    engine.injectCss('test-id', 'css');
    engine.removeCss('test-id');
    
    const style = document.getElementById('test-id');
    expect(style).toBeNull();
  });
});
