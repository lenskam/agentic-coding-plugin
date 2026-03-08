const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const manageTasks = path.resolve(__dirname, '../skills/memory/manage_tasks.js');
const TASK_FILE = path.resolve(__dirname, '../tasks/current.json');

describe('manage_tasks.js', () => {
  beforeEach(() => {
    if (fs.existsSync(TASK_FILE)) fs.unlinkSync(TASK_FILE);
    fs.writeFileSync(TASK_FILE, '[]', 'utf8');
  });

  afterAll(() => {
    if (fs.existsSync(TASK_FILE)) fs.unlinkSync(TASK_FILE);
    fs.writeFileSync(TASK_FILE, '[]', 'utf8');
  });

  it('adds a task', () => {
    execSync(`node ${manageTasks} add "Test Task" "This is a test description"`);
    const tasks = JSON.parse(fs.readFileSync(TASK_FILE, 'utf8'));
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe("Test Task");
    expect(tasks[0].status).toBe("pending");
  });

  it('gets the next task', () => {
    execSync(`node ${manageTasks} add "Test Task 1"`);
    execSync(`node ${manageTasks} add "Test Task 2"`);
    
    const output = execSync(`node ${manageTasks} get-next`, { encoding: 'utf8' }).trim();
    const task = JSON.parse(output);
    expect(task.title).toBe("Test Task 1");
  });

  it('updates a task', () => {
    execSync(`node ${manageTasks} add "Update Task"`);
    let tasks = JSON.parse(fs.readFileSync(TASK_FILE, 'utf8'));
    const id = tasks[0].id;

    execSync(`node ${manageTasks} update ${id} done "Completed successfully"`);
    tasks = JSON.parse(fs.readFileSync(TASK_FILE, 'utf8'));
    
    expect(tasks[0].status).toBe("done");
    expect(tasks[0].result).toBe("Completed successfully");
  });
});
