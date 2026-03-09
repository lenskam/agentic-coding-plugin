# Antigravity Field Examples 🚀

Detailed examples demonstrating how to leverage the Antigravity core features in real-world development.

---

## 1. Planning a Complex Refactor
**Prompt**: *"Refactor the database connection to use a singleton pattern and add connection pooling via SQLAlchemy."*

**Agent Action**: `/plan`
- **T1**: Analyze current DB connection logic (Pending)
- **T2**: Implement `DatabaseManager` singleton in `db.py` (Pending)
- **T3**: Configure SQLAlchemy `create_engine` with `pool_size` (Pending)
- **T4**: Update all repository classes to use the new manager (Pending)
- **T5**: Verify with a connection leak test (Pending)

---

## 2. Cross-Session Memory Retrieval
**Scenario**: You are debugging a performance issue in the production API.

**Action**: `/search "previous performance optimizations on /api/v1/search"`

**Agent Result**:
> Found Memory (Session `optim-152`): "We implemented a Redis cache for the search endpoint on 2026-02-14. The cache TTL is set to 300 seconds. We observed that most hits are for identical queries within this window."

---

## 3. Session Rollback (The Safety Net)
**Scenario**: The agent tried to upgrade a library that caused cascading failures across 15 files.

**Action**: `/undo preview`
- **Output**: Summary of 15 file changes in `packages/shared`.

**Action**: `/undo confirm`
- **Result**: All 15 files restored to their state at the start of the session. The `node_modules` modifications are not tracked, but the `package.json` revert ensures consistency on the next `npm install`.

---

## 4. AST-Level Security Blocking
**Scenario**: An agent tries to implement a "quick fix" using `exec()` to run dynamic strings.

**Agent Input**: `exec(payload)`

**Action**: `checkRules` (Triggered automatically)
- **Result**: 🛑 **BLOCKED**
- **Rule**: `no-exec`
- **Explanation**: "The use of `exec()` is strictly prohibited as it allows remote code execution. Please use a structured parser or safe alternative."

---

## 5. Metadata and Artifacts
**Scenario**: The agent performs a security audit of the codebase.

**Result**: Instead of flooding the chat, the agent saves the 50-page report to:
`artifacts/session-sec-audit-report.md`

You can retrieve it later using:
`cat .agentic-coding/artifacts/session-sec-audit-report.md`
