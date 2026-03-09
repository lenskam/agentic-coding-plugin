# Antigravity Plugin Examples 🌟

Here are some real-world examples of how to use the Antigravity features in your OpenCode workflow.

---

## Example 1: Planning and Decomposing a Feature

**USER**: `"I want to add a new feature that scrapes news from a URL and saves it as a PDF."`

**ASSISTANT**: (Calls `/plan`)
1. **Task 1**: Research news scraping libraries (Status: Pending)
2. **Task 2**: Implement news scraper tool (Status: Pending)
3. **Task 3**: Implement PDF generation tool (Status: Pending)
4. **Task 4**: Integrate tools and add entry point (Status: Pending)

---

## Example 2: Using Semantic Memory for Knowledge Retrieval

**CONTEXT**: You worked on a complex database schema optimization three days ago.

**USER**: `"What was the final decision on the indexing strategy for the user_sessions table?"`

**ASSISTANT**: (Calls `/search "user_sessions indexing strategy decision"`)
> **Memory Found**: "On 2026-03-06, we decided to use a GIN index on the 'metadata' JSONB column instead of separate B-Tree indexes to allow for flexible querying."

---

## Example 3: Reverting a Failed Experiment

**USER**: `"Actually, the last three changes I made broke the build. Can we go back?"`

**ASSISTANT**:
1. (Calls `/undo preview`)
   - Revert: `src/main.ts` (Modified)
   - Delete: `src/broken_feature.ts` (Created)
   - Revert: `package.json` (Modified)
2. **USER**: `"Yes, confirm."`
3. (Calls `/undo confirm`)
   - **Result**: ✅ Workspace restored to the state before the experiment started.

---

## Example 4: Automatic Risk Detection

**USER**: (Trying to commit code with a hardcoded API key)
**ASSISTANT**: (Triggered by Rules Engine / AST check)
> ⚠️ **BLOCKED**: The `security.md` rule detected a potential secret in `config.py`. 
> Found pattern equivalent to `API_KEY = "..."`.
> Action blocked. Please move secrets to an environment variable.

---

## Example 5: Research & Artifacts

**USER**: `"Research competitive AI agents and summarize in a table."`

**ASSISTANT**: (Uses `search_web` and saves to artifacts)
- Saving: `artifacts/session-abc-competitive_analysis.md`
- Resulting file is neatly organized and retrievable via `/artifacts list`.
