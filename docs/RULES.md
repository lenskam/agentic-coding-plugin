# Creating Custom Rules 🛡️

The Antigravity Rules Engine allows you to define constraints and safety checks for your agent. Rules are written in **Markdown** with **YAML frontmatter**.

## Rule File Format

Each rule must be placed in `.opencode/rules/` and follow this structure:

```yaml
---
name: rule-unique-id
description: Human readable description
condition: "The logic/pattern to match"
action: block | warn | approval
---
Detailed explanation of why this rule exists and how to fix the violation.
```

## Available Actions

- **`block`**: Completely stops the execution and returns the explanation as an error.
- **`warn`**: Logs a warning but allows the agent to continue.
- **`approval`**: Forces the agent to ask the user for explicit permission before proceeding.

## Condition Types

### 1. String/Regex Matching
Matches against the action name or the content provided.
- **Example**: `condition: "git commit and file contains 'PRIVATE_KEY'"`

### 2. AST-Level Analysis (Python Only)
Performs deep code analysis using the Abstract Syntax Tree.
- **Syntax**: `AST contains '<NodeType>(<Attributes>)'`
- **Supported Nodes**: `Call`, `Import`, `FunctionDef`, `Assign`.

## Examples

### Blocking dangerous functions
```yaml
---
name: no-os-system
description: Prevent usage of risky system calls
condition: "AST contains 'Call(os.system)'"
action: block
---
Using `os.system` is discouraged. Use the `subprocess` module with proper argument list for safety.
```

### Warning on missing documentation
```yaml
---
name: docstring-check
description: Warn if function lacks docstrings
condition: "AST matches FunctionDef and missing body[0] == Expr(Constant(str))"
action: warn
---
Please ensure all public functions have descriptive docstrings.
```

## Best Practices
1. **Be Specific**: Vague rules lead to false positives.
2. **Provide Fixes**: Always include an explanation in the Markdown body on how the user/agent can resolve the issue.
3. **Use `approval` for Ambiguity**: If an action is sometimes okay but risky, use `action: approval`.
