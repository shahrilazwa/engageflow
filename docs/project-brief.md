# EngageFlow Project Brief

## Purpose

We want to build a small internal tracker for the GovTech engagement team.

The app should help the team monitor engagement progress and status for ministry/agency-owned services that GovTech wants to bring into MyGOV.

The main idea is to provide a clear graphical representation of engagement progress and status, instead of relying only on a manual Excel tracker.

For now, do not build the system yet.

Only create a simple `requirements.md`.

---

## Business Context

GovTech engages ministries and agencies to bring their digital services into MyGOV.

The services are not originally MyGOV features.

They are owned by the ministry or agency.

Example:

`Pembayaran Saman` is a feature/service in the PDRM ecosystem or PDRM app. It is not originally a MyGOV feature. GovTech wants to make it available through MyGOV.

---

## Tracker Structure

The current manual tracker is based on this structure:

- Ministry / Agency Owner
  - Agency-Owned Service
    - Engagement / Integration Workflow

One ministry or agency can have many services.

Each service can have its own progress.

There may also be special projects that are not owners and not normal services.

---

## Main Workflow

Each agency-owned service may go through this workflow:

1. Surat Permohonan Onboard
2. Sesi Libat Urus
3. Surat Permohonan Integrasi
4. Kelulusan
5. Perbincangan / Bengkel Teknikal
6. Bengkel SAF
7. Pembangunan
8. SIT
9. UAT
10. Go-Live

The tracker should help the team know where each service is in this workflow.

---

## Graphical Progress Representation

The app should present engagement progress visually.

The engagement team should be able to quickly see:

- the current workflow stage of each service;
- which stages are completed;
- which stage is currently in progress;
- which stages are pending;
- which services are delayed or at risk;
- which services have reached Go-Live;
- overall progress across all tracked services.

The visual representation may include things like:

- progress bars;
- workflow timeline;
- stage indicators;
- status badges;
- summary cards;
- simple charts.

Do not over-design the UI yet.

For now, capture this as a requirement: the app should make progress and status easy to understand visually.

---

## Target Completion

Each service may have a target completion timeline.

The target means the expected completion up to Go-Live.

The tracker should help identify services that may be delayed or need follow-up.

---

## Current Problem

The engagement team currently tracks this manually.

It is difficult to quickly know:

- which services are being tracked;
- which ministry or agency owns each service;
- which workflow stage each service is at;
- what is pending;
- what is delayed;
- what needs follow-up;
- which services have reached Go-Live;
- the overall engagement progress in a visual way.

---

## What We Need Now

Create `requirements.md` only.

Keep it small and focused.

The requirements should cover:

1. problem statement;
2. basic business context;
3. key entities;
4. workflow stages;
5. basic progress tracking needs;
6. graphical progress/status representation;
7. target completion tracking;
8. clarification questions.

Do not create `design.md`.

Do not create `tasks.md`.

Do not design database tables.

Do not design UI screens.

Do not start coding.