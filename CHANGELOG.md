# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-03-09
### Added
- Modular Python backend stubs (planner, task manager, memory, etc.).
- Distribution templates (prompts, rules, skills, workflows).
- YAML-to-Markdown transition for rules.
- Task JSON schema for the state machine.
- Initial agent persona and system prompts.
### Changed
- Restructured codebase into src/, python/, and templates/.
- Refactored installer with a cleaner mapping logic.
- Updated verify-setup.js for the new modular architecture.

## [1.0.0] - 2026-03-08
### Added
- Initial scaffolding setup for the autonomous agent.
- Task tracking schema and memory storage.
- Safe runner bash wrapper for enforcing agent constraints via YAML rules.
- Verification script for ensuring environments are healthy.
