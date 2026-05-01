# DIYAA Platform Blueprint

This repository now includes a curriculum-driven module architecture for scaling from Nursery to Class 5.

## What Is Added

- `config/curriculumMap.js`
  - Topic map for Nursery to Class 5.
  - Nursery covers English, Maths, Urdu exactly from the provided outline.
  - Class 1 to 5 covers English, Maths, Urdu, Science.

- `config/mechanicsLibrary.js`
  - 12 mechanic families to avoid repeated interaction patterns.
  - Progression modes (`practice`, `mastery`, `challenge`) with scoring profiles.

- `config/moduleCatalog.js`
  - Auto-generates full module catalog with:
    - module id, grade, subject, topic
    - mechanic family and input mode
    - learning outcomes
    - scoring and star thresholds
    - feedback and UI requirements
  - Ensures at least 12 modules per grade-subject:
    - Core modules mapped to syllabus topics
    - Reinforcement modules for mastery loops
  - Adds 2 cross-subject capstone modules per grade.

- `shared/ProgressTracker.js`
  - Centralized progress persistence for all modules:
    - attempts
    - best score
    - accuracy
    - stars
    - summary totals

- `shared/ModuleSession.js`
  - Reusable attempt/session lifecycle:
    - mark correct/wrong
    - score accumulation
    - accuracy computation
    - final progress save

- `shared/CurriculumScene.js`
  - Phaser scene base class for curriculum modules.
  - Includes standard scoring, feedback hooks, and completion commit.

## Module Scale

- 12 modules per grade-subject
- 2 capstone modules per grade
- Total generated modules: **288**

## Integration Pattern For New Levels

1. Define or select a module id from `DIYAA_MODULE_CATALOG`.
2. Create a scene extending `CurriculumScene`.
3. Implement only game-specific interaction logic:
   - call `onCorrectAnswer()` on valid action
   - call `onWrongAnswer()` on invalid action
   - call `completeModule()` on completion
4. Keep UI assets and input adaptations inside the scene while reusing shared systems.

## Why This Supports Long-Term Scale

- Curriculum and gameplay are decoupled from scene implementation.
- Every new level ships with consistent:
  - feedback loop
  - scoring
  - persistence
  - responsive UI baseline
- Teams can parallelize by grade/subject without breaking storage or analytics format.

