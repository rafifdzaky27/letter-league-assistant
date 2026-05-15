# Business Requirements Document (BRD)
## Letter League Solver Assistant — Web Application

**Document Version:** 1.1  
**Date:** May 15, 2026  
**Status:** Revised Draft  
**Target Platform:** Web Application using Next.js  

## Executive Overview

Letter League is a Discord-native word game similar to Scrabble, but with a larger expandable board, a custom scoring model, and two gameplay modes: Wild and Classic.[cite:1][cite:2] This document defines the product requirements for a web-based **Letter League Solver Assistant** that helps users find valid and high-scoring words from their rack and the current board state.[cite:1][cite:2]

The product roadmap is intentionally phased. **Version 1 (V1)** focuses on a reliable and practical solver built around rack input and **manual board pattern input**, rather than automatic screenshot parsing.[cite:1][cite:32] **Version 1.1 (V1.1)** adds OCR-assisted screenshot support as a guided workflow, while **Version 2 (V2)** targets more advanced board-state recognition and automated move generation from uploaded images.[cite:32][cite:39]

## Product Vision

The product should become a fast, reliable, and user-friendly solving assistant for Letter League players who want better move suggestions without manually calculating words and scores.[cite:1] The application should prioritize **accuracy, speed, explainability, and ease of correction**, especially because Letter League's internal dictionary is not publicly exposed as an official API or downloadable canonical source.[cite:1]

## Problem Statement

Players often know their rack letters but still struggle to identify the best possible move, especially when they must incorporate existing letters already on the board.[cite:1] General Scrabble solvers do not fully align with Letter League's rules, including its board behavior, score differences such as the value of L, and mode-specific scoring behavior.[cite:2]

A more ambitious user experience would let players upload a screenshot of the board and receive instant move suggestions, but that introduces image parsing, OCR quality issues, board-cell detection, and bonus-tile interpretation challenges that are materially more complex than a traditional text-based solver.[cite:32][cite:39] For that reason, the first release should focus on a robust text-input workflow and defer image-driven automation to future versions.[cite:32]

## Product Scope

### In Scope for V1

V1 is the first production release and must be limited to a dependable text-based solving workflow.

- Next.js-based web application.
- Manual rack input.
- Manual board pattern input.
- Dictionary-backed word generation using a bundled local dictionary file.
- Score estimation based on Letter League rules.
- Results ranking, sorting, and filtering.
- Word validity lookup against the bundled dictionary.
- Mobile-responsive user interface.
- Basic confidence and disclaimer messaging about dictionary mismatch risk.[cite:1]

### Out of Scope for V1

- Automatic screenshot parsing.
- OCR-based board extraction.
- Fully automatic board-state reconstruction.
- Discord API integration.
- Direct interaction with Discord Activities.
- User accounts and cloud sync.
- Real-time multiplayer features.

### Planned Scope for V1.1

- Screenshot upload.
- OCR-assisted extraction of rack letters and simple board text.
- User review and correction workflow before solving.
- Confidence markers for uncertain OCR results.[cite:32]

### Planned Scope for V2

- Automated board-grid detection from screenshots.
- Bonus tile recognition.
- Full board-state reconstruction from image input.
- Automatic move generation from parsed board state.
- Smarter correction suggestions for low-confidence OCR/cell reads.[cite:39]

## Product Strategy by Version

| Version | Goal | Main Interaction Model | Risk Level |
|---|---|---|---|
| V1 | Deliver a reliable usable solver quickly | Manual rack + manual board pattern input | Low |
| V1.1 | Reduce input effort without overpromising automation | Screenshot upload with OCR-assisted review | Medium |
| V2 | Deliver near-automatic solving from screenshots | Full board-image parsing and move generation | High |

## How the App Knows Words

The application will not depend on an external word-validation API for its core behavior. Instead, it will use a **bundled local dictionary file** supplied as a `.txt` asset and loaded into the application at runtime or build time.[cite:1] This decision reduces latency, eliminates external API cost, avoids uptime dependency on third-party services, and supports private local solving behavior.[cite:32]

Because Discord does not publicly document an official Letter League word-validation API or canonical downloadable dictionary in the FAQ, the bundled dictionary must be treated as a practical approximation rather than a guaranteed one-to-one mirror of the game's internal accepted-word list.[cite:1] The product must therefore include product messaging and future maintainability features that acknowledge possible false positives and false negatives.

## Stakeholders

| Role | Responsibility |
|---|---|
| Product Owner | Defines scope, priorities, and roadmap decisions |
| Frontend Engineer | Builds Next.js UI and client-side interaction layers |
| Solver Engineer | Implements word-generation and scoring logic |
| OCR/Computer Vision Engineer | Future V1.1 and V2 image-processing features |
| QA Engineer | Tests rule accuracy, performance, and responsive behavior |
| End User | Letter League player using the app during gameplay |

## Functional Requirements — V1

### V1-F1 Rack Input

The system shall allow the user to enter the current rack letters manually. The rack input must support standard alphabetic letters plus blank/wildcard representation such as `?`.[cite:1]

#### Requirements
- Accept rack input through typed characters and optional clickable tile entry UI.
- Normalize lowercase to uppercase.
- Support blank tiles with `?`.
- Validate and reject invalid characters.
- Allow quick clear/reset actions.
- Show the interpreted rack visually as tiles.

### V1-F2 Manual Board Pattern Input

The system shall allow the user to describe the current board pattern manually so the solver can produce words that fit known constraints. This is the key bridge between rack-only solving and full screenshot automation.

#### Requirements
- Provide a structured board pattern input area.
- Support one or more fixed-letter patterns, such as known letters in a row or column.
- Support placeholders for unknown spaces, for example `A..T` or `.E..R` depending on final syntax rules.
- Support optional cross-letter constraints in future refinement, but keep V1 focused on main-line pattern assistance.
- Allow the user to specify whether the pattern is horizontal or vertical.
- Allow optional fields for known bonus tiles later, but do not require them in V1.

#### Expected V1 Input Model
A practical V1 approach is:
- Rack: `ADELRT?`
- Board pattern: `.E..R`
- Meaning: generate words that fit the pattern and can be formed using the rack plus the fixed letters already on board.

### V1-F3 Dictionary Loader

The system shall load a bundled dictionary file from a local application asset rather than a remote validation API.[cite:1] The dictionary must be available to the solver engine with acceptable startup performance.

#### Requirements
- Load a `.txt` dictionary file from the application bundle or public assets directory.
- Preprocess words into data structures suitable for fast lookup and matching.
- Support dictionary replacement or update without major code changes.
- Keep dictionary logic modular so future allowlists/blocklists can be layered on top.

### V1-F4 Word Solver Engine

The system shall generate valid candidate words using the user rack and the manual board pattern.

#### Requirements
- Match candidate words against the board pattern.
- Verify required letters can be satisfied by the rack plus board-fixed letters.
- Support blanks as wildcard substitutions.
- Return candidate words ranked by score by default.
- Support additional ranking by length and alphabetical order.
- Keep search performance within a usable time window on modern devices.

### V1-F5 Scoring Engine

The system shall estimate score using Letter League rules as far as V1 inputs allow.[cite:1][cite:2]

#### Requirements
- Use Letter League letter values, including the modified value for `L` described in community references.[cite:2]
- Support mode toggle for Classic and Wild display behavior, even if V1 scoring remains partially estimated when board multiplier context is incomplete.[cite:2]
- Show clear distinction between base word score and estimated placement-aware score where applicable.
- Document cases where exact score cannot be guaranteed because manual board bonus data is incomplete.

### V1-F6 Results Panel

The system shall display suggested words in a structured and filterable format.

#### Requirements
- Show word, score, length, and notes such as blank usage.
- Support sorting by score, length, and alphabetical order.
- Support filtering by word length and blank usage.
- Provide a one-click copy action for selected word suggestions.
- Show count of returned candidate words.

### V1-F7 Dictionary Check Tool

The system shall include a direct word lookup feature against the bundled dictionary.

#### Requirements
- User can type a word and test if it exists in the local dictionary.
- The UI must make clear that this reflects the bundled dictionary, not an official Discord validation endpoint.[cite:1]
- Show the computed base score for the queried word.

### V1-F8 Dictionary Confidence Handling

The system shall communicate uncertainty where the bundled dictionary may differ from Letter League's accepted words.[cite:1]

#### Requirements
- Display a small but visible disclaimer near results.
- Provide a future-ready mechanism for marking false positives and false negatives.
- Maintain internal support for a local custom allowlist and denylist in future updates.

## Functional Requirements — V1.1

### V1.1-F1 Screenshot Upload

The system shall allow users to upload a screenshot from Letter League for OCR-assisted extraction.[cite:32]

### V1.1-F2 OCR-Assisted Rack Extraction

The system shall attempt to identify rack letters from the screenshot and prefill the rack input for user review.[cite:32]

### V1.1-F3 OCR-Assisted Pattern Suggestion

The system shall attempt to identify simple visible word fragments or rows and propose board patterns for the user to confirm or correct.[cite:32][cite:39]

### V1.1-F4 Correction Workflow

The system shall require user confirmation before solver execution when OCR-derived input is used. This avoids overreliance on uncertain image parsing.[cite:32]

## Functional Requirements — V2

### V2-F1 Board Detection

The system shall detect the board region and its cells from a screenshot automatically.[cite:39]

### V2-F2 Tile Recognition

The system shall recognize placed letters, identify empty spaces, and infer orientation/coordinates.[cite:39]

### V2-F3 Bonus Recognition

The system shall recognize visible multiplier tiles where possible and incorporate them into score calculation.[cite:39]

### V2-F4 Automatic Move Generation

The system shall convert parsed image state into full move suggestions without requiring manual board pattern entry.[cite:39]

## Non-Functional Requirements

### Performance

- Initial page readiness should be fast enough for in-game usage.
- Solver response should feel near-instant for typical rack and pattern queries.
- Dictionary loading must avoid freezing the main interface.
- Future OCR workflows may take longer, but progress indicators are required.[cite:32]

### Usability

- The application must be fully usable on desktop and mobile browsers.
- Inputs must be understandable to non-technical users despite using pattern syntax.
- Empty states and examples must teach the pattern format quickly.
- Error messages must explain why input is invalid and how to fix it.

### Accessibility

- Keyboard-accessible interaction for all controls.
- Sufficient contrast and visible focus states.
- Clear labels for form inputs and toggles.
- Responsive design that works in narrow mobile widths.

### Privacy

- V1 should not require user accounts.
- Dictionary solving should be possible locally without sending rack input to a remote service.
- If future OCR processing uses server resources, privacy messaging must explain what image data is processed and whether it is stored.[cite:32]

## Recommended Technology Stack

The application should use **Next.js with TypeScript** as the primary framework because the product benefits from structured components, scalable routing, and future compatibility with image-upload workflows and possible server-side OCR support.[cite:32]

| Layer | Recommendation | Notes |
|---|---|---|
| Framework | Next.js | Main web application framework |
| Language | TypeScript | Safer logic for solver and scoring rules |
| Styling | Tailwind CSS | Fast UI implementation and consistency |
| State | React state initially, Zustand if complexity grows | Avoid overengineering V1 |
| Forms | React Hook Form or native controlled forms | Good for validation-heavy inputs |
| Data source | Bundled local `.txt` dictionary | Replaceable and versionable |
| OCR for future | Tesseract.js and/or image preprocessing pipeline | Best suited for V1.1 experimentation[cite:32] |

## High-Level Architecture

### V1 Architecture

```text
User Input (Rack + Pattern)
        ↓
Input Parser
        ↓
Dictionary Loader
        ↓
Solver Engine
        ↓
Scoring Engine
        ↓
Results Renderer
```

### Future OCR Extension Architecture

```text
Screenshot Upload
        ↓
Image Preprocessing
        ↓
OCR / Pattern Detection
        ↓
User Review & Correction
        ↓
Solver Engine
        ↓
Results Renderer
```

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Bundled dictionary does not perfectly match Letter League accepted words | Medium | Add disclaimer, future allowlist/denylist, mismatch reporting |
| Manual board pattern syntax confuses users | Medium | Add examples, helper UI, inline validation, pattern builder |
| Screenshot OCR is less accurate than expected | High | Keep OCR out of V1, require manual review in V1.1[cite:32] |
| Full screenshot automation becomes too costly or fragile | High | Defer to V2 after core solver proves value[cite:39] |
| Wild-mode scoring is hard to model without full board data | Medium | Distinguish exact vs estimated scoring clearly[cite:2] |

## User Stories

| ID | User Story |
|---|---|
| US-01 | As a player, I want to enter my rack letters so the app can suggest valid words. |
| US-02 | As a player, I want to define a board pattern manually so suggestions fit the current board. |
| US-03 | As a player, I want to sort by score so I can pick strong plays quickly. |
| US-04 | As a player, I want to know when a result may be uncertain because of dictionary mismatch. |
| US-05 | As a player, I want a direct word checker to test words quickly. |
| US-06 | As a player, I want future screenshot assistance so I can reduce manual typing later. |

## Acceptance Summary for V1

V1 is accepted when the application can reliably load a bundled dictionary, accept rack input, accept manual board pattern input, return candidate words that fit both constraints, estimate scores, and present usable results in a responsive Next.js interface. The release must also clearly communicate that dictionary validity is based on the bundled local source rather than an official Letter League API.[cite:1]

## Delivery Roadmap

| Phase | Focus | Outcome |
|---|---|---|
| V1 | Rack solver + manual board pattern input | Stable usable solver release |
| V1.1 | OCR-assisted screenshot workflow | Faster input with user correction |
| V2 | Automated screenshot understanding | Semi-automatic or automatic full-board solver |

## Recommendation

The best implementation path is to launch V1 with **rack-only plus manual board pattern input** because it offers strong practical value with manageable engineering risk. Screenshot-driven automation remains attractive and feasible, but should be treated as a staged roadmap feature rather than a launch requirement because OCR and board-state reconstruction add significant complexity beyond the core solver problem.[cite:32][cite:39]
