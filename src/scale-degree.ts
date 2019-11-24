import {norm, settings} from "./global";

export class ScaleDegree {
    private readonly value: number;

    static fromValue(value: number): ScaleDegree {
        return new ScaleDegree(value);
    }

    static fromName(name: string): ScaleDegree {
        const degreeValues: { [index: string]: number } = {'1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11};
        let degreeValue = degreeValues[name.charAt(name.length - 1)];

        for (let i = 0; i < name.length - 1; i++) {
            switch (name.charAt(i)) {
                case 'b':
                    degreeValue--;
                    break;
                case '#':
                    degreeValue++;
                    break;
                default:
                    throw new Error("Invalid scale degree name!");
            }
        }

        return new ScaleDegree(degreeValue);
    }

    private constructor(value: number) {
        this.value = norm(value);
    }

    getValue(): number {
        return this.value;
    }

    getName(): string {
        for (const scaleDegreeName of settings.scale.degrees) {
            if (this.equals(ScaleDegree.fromName(scaleDegreeName))) {
                return scaleDegreeName;
            }
        }

        throw new Error("Scale degree name not known!");
    }

    equals(other: ScaleDegree) {
        return this.value === other.value;
    }
}
