# Game Styles & Interaction Logic Summary

The DIYAA educational platform utilizes several distinct interactive game styles to teach different concepts across all classes. Below is a breakdown of the core game styles (mechanics) implemented and examples of the levels they are used in.

## 1. Multiple Choice (MCQs) / Tap to Select
**Internal ID:** `kind: "tap"`
The most common interaction style. The player is presented with a prompt, image, or question, and must tap the correct card/button from 2 to 4 options.

*   **Used In:**
    *   **Nursery (Maths/Urdu):** Counting dots, identifying the odd shape out, picking the correct starting letter.
    *   **Class 1-5 (English/Urdu):** Selecting the correct verb form, picking the right adjective, choosing opposites (mutazad), identifying vowels vs. consonants.
    *   **Class 4-5 (Science/Computer):** Identifying input/output devices, selecting the correct states of matter, answering multiple-choice questions about ecosystems and the solar system.

## 2. Drag and Drop / Sequencing
**Internal ID:** `kind: "sequence"`, `kind: "compose"`, `kind: "sort"`
Players drag interactive blocks, words, or numbers and drop them into designated slots or target areas to form a correct order or grouping.

*   **Used In:**
    *   **English/Urdu (All Classes):** Sentence Building / Jumlay. Dragging individual words to arrange them into a grammatically correct sentence.
    *   **Maths:** Dragging numbers to complete a sequence (e.g., 1, 2, _, 4), sorting numbers into Even/Odd buckets.
    *   **Computer Science:** Arranging the steps of an algorithm in the correct logical order.
    *   **Science:** Sorting animals into categories (e.g., Mammals, Birds, Reptiles).

## 3. Voice Control / Speech Interaction
**Internal ID:** `kind: "voice"`
A specialized interaction where the game prompts the user to speak into the device's microphone to practice pronunciation. 

*   **Used In:**
    *   **Nursery (Urdu/English):** Voice Letter levels (`voice-letter`). The game shows a letter (e.g., "ب" or "A") and asks the child to speak the letter aloud. 

## 4. Memory Match
**Internal ID:** `kind: "memory"`
A classic card-flipping game where players must remember the positions of hidden cards and find matching pairs.

*   **Used In:**
    *   **Nursery & Class 1:** Matching uppercase letters to lowercase letters, matching a picture to its starting letter, or matching identical Urdu Huroof.
    *   **Class 2 & 3 (Language):** Matching a word to its opposite (Antonyms/Mutazad).

## 5. Tracing and Drawing
**Internal ID:** Custom Phaser Path Logic
Players use their finger or mouse to trace along a predefined path to practice handwriting and motor skills.

*   **Used In:**
    *   **Nursery (English/Urdu):** Alphabet tracing games. The player follows directional arrows to trace letters from A-Z or Alif to Yay, collecting stars along the path.

## 6. Concept Comparison
**Internal ID:** `kind: "concept"`
A visual comparison mechanic where players observe images and select the one that fits a specific relational concept.

*   **Used In:**
    *   **Nursery (Maths):** "Big vs Small", "Tall vs Short", "Heavy vs Light" concept comparisons. 
