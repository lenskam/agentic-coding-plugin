const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const memoryAppend = path.resolve(__dirname, '../skills/memory/memory_append.js');
const MEMORY_FILE = path.resolve(__dirname, '../memory/session.json');

describe('memory_append.js', () => {
  beforeEach(() => {
    if (fs.existsSync(MEMORY_FILE)) fs.unlinkSync(MEMORY_FILE);
    fs.writeFileSync(MEMORY_FILE, '[]', 'utf8');
  });

  afterAll(() => {
    if (fs.existsSync(MEMORY_FILE)) fs.unlinkSync(MEMORY_FILE);
    fs.writeFileSync(MEMORY_FILE, '[]', 'utf8');
  });

  it('appends an action to memory log', () => {
    execSync(`node ${memoryAppend} "test_action" "Successfully ran test"`);
    const logs = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
    
    expect(logs.length).toBe(1);
    expect(logs[0].action).toBe("test_action");
    expect(logs[0].result).toBe("Successfully ran test");
    expect(logs[0].timestamp).toBeDefined();
  });
});
