# Architecture

This document describes the current target architecture for EngageFlow.

---

## Overview

EngageFlow is a Laravel modular monolith with an Inertia React frontend. The v1 product is Project-first, workflow-first, visual-builder-first, and single-user-first. There are no microservices in v1.

**MVP 0 (Foundation) is complete.** The application has session authentication, owner-only Project CRUD with soft-delete and archive, ProjectWorkflow JSONB storage (auto-created per Project), an authenticated app shell with MYDS-aligned navigation, and a staged CI pipeline.

The backend owns persistence, authorization, validation, and workflow/task business rules. The frontend owns page composition, MYDS-aligned UI, React Flow workflow editing, and client-side interaction state.

---

## Technology Stack

| Layer | Choice |
|---|---|
| Language | PHP 8.4 |
| Framework | Laravel |
| Frontend | Inertia.js + React + TypeScript |
| Styling | MYDS React, MYDS Style, and Tailwind CSS layout composition |
| Icons | FontAwesome or MYDS-compatible icons |
| Workflow canvas | `@xyflow/react` / React Flow |
| Database | PostgreSQL with JSONB for Project workflow definitions |
| ORM | Eloquent ORM and Laravel Query Builder |
| Authentication | Laravel session authentication |
| Authorization | Laravel Policies with owner-only Project access in v1 |
| Testing | PestPHP, PHPStan/Larastan, Laravel Pint, TypeScript, and Vite build checks |
| CI | GitHub Actions staged quality gates |
| Local Dev | Docker Compose container-first development |

---

## Application Areas

| Area | Responsibility |
|---|---|
| Authentication | Login, logout, session protection, and Inertia auth props |
| Projects | Owner-scoped Project creation, selection, editing, and authorization |
| Project Workflows | One JSONB workflow definition per Project |
| Workflow Builder | React Flow canvas, ordered stages, mandatory flags, validation, save, and reload |
| Tasks | Task records created from a snapshot of the current Project workflow |
| Task Workflow Steps | Relational step snapshots and progress/status tracking |
| Dashboard | Project-scoped counts, progress, delayed status, search, and filters |
| Deliverables | Expected Task outputs and status tracking |
| Document Links | External URLs attached to supported entities; no file upload in v1 |
| Follow-Ups | Operational action tracking and overdue status |
| Audit History | Status-change history for workflow steps, deliverables, and follow-ups |

---

## Backend Boundaries

Business rules belong in actions, policies, form requests, model relationships, and tests. Hidden frontend state must not be the only enforcement point.

Workflow definition validation is server-side. Routine dashboard counts use relational Task and TaskWorkflowStep data, not raw JSON parsing.

---

## Frontend Boundaries

React components should be modular and typed. Page-level components compose small feature components, while feature components expose clear props and avoid coupling to unrelated pages.

The WorkflowCanvas is design-time only. Task progress and TaskWorkflowStep status updates happen outside the canvas.

---

## Future Scope Boundaries

The following are not part of v1: collaboration, OIDC/SSO, Spatie Permission, workflow automation, file uploads, external repository integrations, public API, mobile app, microservices, and cross-Project dashboards.
