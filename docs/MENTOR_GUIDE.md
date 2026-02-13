# 🎯 APERTRE’26 MENTOR MASTER GUIDE

This guide is for Project Admins (`deepaksinghh12`) and Mentors. Follow strictly to ensure mentees get their points and the repo stays clean.

## ⭐ PART 1 — ISSUE DIFFICULTY CHEATSHEET

Use this to tag issues correctly.

| Tag | Points | Criteria |
| :--- | :--- | :--- |
| **🟢 EASY** | **5** | Minor UI fixes, Color changes, Button alignment, Small component fixes, Text changes, Documentation |
| **🟡 MEDIUM** | **7** | Page-level changes, Form validation, Small components added, Moderate UI restructuring |
| **🔴 HARD** | **10** | New features, New pages, Complex layout, Security fixes, Backend/API fixes |

## ⭐ PART 2 — PR MERGE WORKFLOW

Every PR merge must follow this **EXACT** flow:

### STEP 1 — Check Requirements
Does the PR have:
*   [ ] `apertre3.0` label?
*   [ ] **One** difficulty label (`easy` / `medium` / `hard`)?
*   [ ] Linked issue (`Closes #123`)?
*   [ ] Screenshots (for UI)?

**❌ If MISSING:** Request changes with this comment:
> Please add `apertre3.0` and the difficulty label (`easy`/`medium`/`hard`) as required by Apertre guidelines.

### STEP 2 — Code Review
*   Clean code?
*   No `console.log`?
*   No random files?

### STEP 3 — Merge
*   **Squash & Merge** only.
*   Ensure the tags are present on the PR before clicking merge.

## ⭐ PART 3 — COMMENT TEMPLATES

### ✔ Issue Assignment
> Assigned! 🚀
> This issue is tagged under **Apertre 3.0**.
>
> **Difficulty Level:** <easy/medium/hard>
> Please follow [CONTRIBUTING.md](../contributing.md) and submit a clean PR.

### ✔ PR Approval
> Great work! 🎉
> Your PR meets all Apertre'26 requirements:
>
> *   `apertre3.0` tag added
> *   Difficulty tag added
> *   Linked to issue
> *   Clean implementation
> *   Screenshots included
>
> Approving and merging now. 🚀

### ✔ Request Changes (Missing Tags)
> Please add the required tags:
>
> *   `apertre3.0`
> *   Difficulty tag: `easy` / `medium` / `hard`
>
> This is mandatory for Apertre'26 points.

## ⭐ PART 4 — AUTOMATION
*   **Auto-Assign**: Issues are automatically assigned to `deepaksinghh12`.
*   **Auto-Labeler**: Tries to guess difficulty based on file type. **Verify this manually.**
