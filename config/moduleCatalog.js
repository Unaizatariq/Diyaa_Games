import { curriculumMap, gradeOrder } from "./curriculumMap.js";
import { mechanicsLibrary, progressionModes } from "./mechanicsLibrary.js";

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getMode(index) {
    if (index <= 4) return "practice";
    if (index <= 8) return "mastery";
    return "challenge";
}

function buildLearningOutcomes(grade, subject, topic) {
    return [
        `Identify and apply the core concept of "${topic}".`,
        `Respond correctly to curriculum-aligned ${subject} prompts for ${grade}.`,
        "Demonstrate retention through immediate feedback and retry loops."
    ];
}

function buildModuleId(grade, subject, topic, sequence) {
    return `${grade}_${subject}_${String(sequence).padStart(2, "0")}_${slugify(topic)}`;
}

function createCoreModule({ grade, subject, topic, sequence, mechanic }) {
    const modeKey = getMode(sequence);
    const mode = progressionModes[modeKey];
    const moduleId = buildModuleId(grade, subject, topic, sequence);

    return {
        moduleId,
        grade,
        subject,
        sequence,
        title: topic,
        topic,
        mechanic: {
            id: `${mechanic.id}-${grade}-${subject}-${sequence}`,
            family: mechanic.family,
            inputMode: mechanic.inputMode,
            summary: mechanic.summary
        },
        pacing: modeKey,
        rounds: mode.rounds,
        scoring: {
            scorePerCorrect: mode.scorePerCorrect,
            starThresholds: mode.stars
        },
        learningOutcomes: buildLearningOutcomes(grade, subject, topic),
        feedback: {
            audio: true,
            visual: true,
            hints: sequence <= 3
        },
        ui: {
            useLargeTouchTargets: true,
            minTapSize: 56,
            allowResponsiveScale: true
        }
    };
}

function createReinforcementModules({ grade, subject, startSequence, count, mechanicOffset }) {
    const modules = [];

    for (let i = 0; i < count; i++) {
        const sequence = startSequence + i;
        const mechanic = mechanicsLibrary[(mechanicOffset + sequence + 1) % mechanicsLibrary.length];
        const topic = `Reinforcement Sprint ${i + 1}`;

        modules.push({
            moduleId: `${grade}_${subject}_${String(sequence).padStart(2, "0")}_reinforcement_${i + 1}`,
            grade,
            subject,
            sequence,
            title: `${subject.toUpperCase()} Reinforcement ${i + 1}`,
            topic,
            mechanic: {
                id: `${mechanic.id}-${grade}-${subject}-reinforcement-${i + 1}`,
                family: mechanic.family,
                inputMode: mechanic.inputMode,
                summary: `${mechanic.summary} Focused revision set ${i + 1}.`
            },
            pacing: "challenge",
            rounds: 12,
            scoring: {
                scorePerCorrect: 14,
                starThresholds: [75, 95, 120]
            },
            learningOutcomes: [
                `Consolidate previous ${subject} concepts for ${grade}.`,
                "Strengthen retention with mixed prompts and quick retries.",
                "Build mastery confidence before assessment."
            ],
            feedback: { audio: true, visual: true, hints: false },
            ui: { useLargeTouchTargets: true, minTapSize: 56, allowResponsiveScale: true }
        });
    }

    return modules;
}

function createCapstoneModules(grade) {
    return [
        {
            moduleId: `${grade}_capstone_01_cross_subject_mission`,
            grade,
            subject: "capstone",
            sequence: 1,
            title: "Cross Subject Adventure",
            topic: "Mixed concepts from English, Maths, Urdu, Science",
            mechanic: {
                id: `capstone-mission-${grade}`,
                family: "mission",
                inputMode: "multi-step",
                summary: "A story mission where each gate tests one subject."
            },
            pacing: "challenge",
            rounds: 12,
            scoring: {
                scorePerCorrect: 15,
                starThresholds: [75, 95, 120]
            },
            learningOutcomes: [
                "Transfer knowledge across subjects in one session.",
                "Sustain attention through mixed interactions.",
                "Demonstrate grade-level readiness."
            ],
            feedback: { audio: true, visual: true, hints: false },
            ui: { useLargeTouchTargets: true, minTapSize: 56, allowResponsiveScale: true }
        },
        {
            moduleId: `${grade}_capstone_02_mastery_boss`,
            grade,
            subject: "capstone",
            sequence: 2,
            title: "Mastery Boss Arena",
            topic: "Timed cumulative revision",
            mechanic: {
                id: `capstone-boss-${grade}`,
                family: "revision",
                inputMode: "mixed",
                summary: "Boss-style revision with escalating rounds."
            },
            pacing: "challenge",
            rounds: 14,
            scoring: {
                scorePerCorrect: 16,
                starThresholds: [90, 110, 140]
            },
            learningOutcomes: [
                "Apply learned skills under time pressure.",
                "Build confidence with cumulative practice.",
                "Reach mastery through adaptive repetition."
            ],
            feedback: { audio: true, visual: true, hints: false },
            ui: { useLargeTouchTargets: true, minTapSize: 56, allowResponsiveScale: true }
        }
    ];
}

function generateCatalog() {
    const modules = [];

    gradeOrder.forEach((grade, gradeIndex) => {
        const subjects = curriculumMap[grade];
        const subjectKeys = Object.keys(subjects);

        subjectKeys.forEach((subject, subjectIndex) => {
            const topics = subjects[subject];
            const mechanicOffset = (gradeIndex * 3 + subjectIndex * 2) % mechanicsLibrary.length;

            topics.forEach((topic, topicIndex) => {
                const sequence = topicIndex + 1;
                const mechanic = mechanicsLibrary[(mechanicOffset + topicIndex) % mechanicsLibrary.length];

                modules.push(
                    createCoreModule({
                        grade,
                        subject,
                        topic,
                        sequence,
                        mechanic
                    })
                );
            });

            const minModulesPerSubject = 12;
            const reinforcementCount = Math.max(0, minModulesPerSubject - topics.length);
            if (reinforcementCount > 0) {
                modules.push(...createReinforcementModules({
                    grade,
                    subject,
                    startSequence: topics.length + 1,
                    count: reinforcementCount,
                    mechanicOffset
                }));
            }
        });

        modules.push(...createCapstoneModules(grade));
    });

    return modules;
}

export const DIYAA_MODULE_CATALOG = generateCatalog();

export const moduleStats = {
    totalModules: DIYAA_MODULE_CATALOG.length,
    byGrade: gradeOrder.reduce((acc, grade) => {
        acc[grade] = DIYAA_MODULE_CATALOG.filter(module => module.grade === grade).length;
        return acc;
    }, {})
};

export function getModulesByGradeSubject(grade, subject) {
    return DIYAA_MODULE_CATALOG.filter(module => (
        module.grade === grade && module.subject === subject
    ));
}

export function getModuleById(moduleId) {
    return DIYAA_MODULE_CATALOG.find(module => module.moduleId === moduleId) || null;
}
