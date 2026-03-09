# Example Workflows 🔄

Antigravity workflows allow you to automate multi-step processes. These are defined in `.opencode/workflows/`.

## 1. Feature Implementation Flow
This is the standard loop for adding new functionality.

1. **Plan**: `/plan "Add feature X"`
2. **Execute**: The agent implements the code.
3. **Verify**: The Rules Engine automatically checks the code.
4. **Test**: Run unit tests.
5. **Review**: `/changes show` to see the diff.
6. **Commit**: Git commit if satisfied.

## 2. Research & Recovery Flow
Use this when exploring unfamiliar codebases.

1. **Search**: `/search "How does module Y work?"`
2. **Memory**: The agent retrieves context from previous research sessions.
3. **Experiment**: Modify code to test hypotheses.
4. **Mistake?**: `/undo preview` to check experiment impact.
5. **Rollback**: `/undo confirm` to return to a clean state.

## 3. Security Audit Workflow
Ensure secrets and dangerous patterns don't enter the codebase.

1. **Implement**: Agent writes configuration code.
2. **Audit**: Running `/checkRules` manually or automatically on write.
3. **Block**: Agent detects `AST contains 'Assign(API_KEY)'`.
4. **Remediate**: Agent moves key to `.env` based on rule guidance.

## Tips for Success
- **Start with `/plan`**: Even for small tasks, planning sets the right context for the agent's memory.
- **Review frequently**: Use `/changes show` often to ensure the agent isn't drifting from the desired implementation.
- **Trust the Undo**: Don't be afraid to let the agent experiment in a sandbox session; you can always rollback!
