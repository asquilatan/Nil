<!--
Sync Impact Report:
- Version change: Template -> 1.0.0
- Added Principles: High Test Coverage, Modular Extensibility, Consistent UI/UX, Simplicity
- Added Sections: Design & UI Guidelines, Development Workflow
- Templates alignment:
  - plan-template.md: Checked (Ready for Constitution Check)
  - spec-template.md: Checked (Aligned with testing/requirements)
  - tasks-template.md: Checked (Includes testing tasks)
-->

# Nil Constitution

## Core Principles

### I. High Test Coverage
Aim for high test coverage across the codebase. Ensure that critical paths are covered by unit and integration tests to maintain reliability and facilitate future refactoring.

### II. Modular Extensibility
Ensure that the system is modularized to allow for other social media platforms to be added later. Architecture must support plugin-like or adapter-based extensions without rewriting core logic.

### III. Consistent UI/UX
Maintain consistent UI/UX throughout the application. Use shared components and design tokens to ensure a cohesive user experience.

### IV. Simplicity
Favor simplicity over complexity in both code and design. Solutions should be straightforward and avoid over-engineering.

## Design & UI Guidelines

### Visual Style
- **Avoid Gradients**: Do not use gradients when creating UIs. Use flat colors.
- **Simplicity**: Interface designs should remain clean and uncluttered.

## Development Workflow

### Testing Protocol
- Tests are a priority. New features should include accompanying tests.

### Code Review Standards
- Verify modularity compliance for any platform-related features.
- Ensure UI consistency.

## Governance

This constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan if breaking changes are introduced.

**Version**: 1.0.0 | **Ratified**: 2025-12-07 | **Last Amended**: 2025-12-07