import {ExerciseController} from "../components/exercise";
import {FretboardSettings} from "../components/fretboard";
import {Scale} from "../model/scale";
import {ScaleDegree} from "../model/scale-degree";
import {FretboardData} from "../model/fretboard-data";

export class MarkDegreeOnStringExercise implements ExerciseController {
    private readonly fretboardSettings: FretboardSettings;
    private readonly scale: Scale;

    private currentString: number;
    private currentDegree: ScaleDegree;

    constructor(fretboardSettings: FretboardSettings, scale: Scale) {
        this.fretboardSettings = fretboardSettings;
        this.scale = scale;
        this.currentString = 0;
        this.currentDegree = this.scale.degrees[0];
    }

    nextQuestion(): { question: string; degree: ScaleDegree } {
        const availableDegreesOnStrings = [];
        for (let string = 0; string < FretboardData.getStringCount(); string++) {
            if (string === this.currentString) {
                continue;
            }

            const data = new FretboardData(this.scale);
            data.setScale();
            data.clip(this.fretboardSettings);
            data.filter(position => position.string === string);

            if (!data.isEmpty()) {
                availableDegreesOnStrings.push({string, degrees: data.map((_position, content) => content.degree)});
            }
        }

        const degreesOnString = availableDegreesOnStrings[Math.floor(Math.random() * availableDegreesOnStrings.length)];
        this.currentString = degreesOnString.string;
        this.currentDegree = degreesOnString.degrees[Math.floor(Math.random() * degreesOnString.degrees.length)];

        const stringNames: { [index: number]: string } = {0: '1st', 1: '2nd', 2: '3rd', 3: '4th', 4: '5th', 5: '6th'};
        const stringName = stringNames[this.currentString];

        return {
            question: `In the key of ${this.scale.root.name}, where do you find the ${this.currentDegree.text} on the ${stringName} string?`,
            degree: this.currentDegree,
        };
    }

    validateAnswer(selection: FretboardData): boolean {
        const correct = new FretboardData(this.scale);
        correct.setNote(this.scale.note(this.currentDegree));
        correct.clip(this.fretboardSettings);
        correct.filter(position => position.string === this.currentString);

        return selection.equals(correct);
    }
}
