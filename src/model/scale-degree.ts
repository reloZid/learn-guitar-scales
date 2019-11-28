import {Scale} from "./scale";

export class ScaleDegree {

    static fromValue(value: number, scale?: Scale): ScaleDegree {
        if (value < 0 || value > 11) {
            throw new TypeError('Invalid scale degree value!');
        }

        // try to use the same name as in the scale
        if (scale) {
            for (const scaleDegree of scale.degrees) {
                if (scaleDegree.value === value) {
                    return scaleDegree;
                }
            }
        }

        // otherwise use default name
        const defaultNames: { [index: number]: string } = {
            0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
        };
        return new ScaleDegree(defaultNames[value]);
    }

    static fromName(name: string): ScaleDegree {
        return new ScaleDegree(name);
    }

    private static isNameValid(name: string): boolean {
        if (name.length < 1) {
            return false;
        }

        const degreeNumber = parseInt(name.charAt(name.length - 1));
        if (isNaN(degreeNumber) || degreeNumber < 1 || degreeNumber > 7) {
            return false;
        }

        const degreeModifier = ['', 'b', 'bb', '#', '##'];
        return degreeModifier.includes(name.substring(0, name.length - 1));
    }

    private static calcValue(name: string): number {
        const degreeValues: { [index: string]: number } = {'1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11};
        const degreeModifiers: { [index: string]: number } = {'': 0, 'b': -1, 'bb': -2, '#': 1, '##': 2};
        const degreeValue = degreeValues[name.charAt(name.length - 1)];
        const degreeModifier = degreeModifiers[name.substring(0, name.length - 1)];
        return degreeValue + degreeModifier;
    }

    readonly name: string;
    readonly value: number;

    private constructor(name: string) {
        if (!ScaleDegree.isNameValid(name)) {
            throw new TypeError('Invalid scale degree name!');
        }

        this.name = name;
        this.value = ScaleDegree.calcValue(name);
    }

    get text() {
        if (this.name == '1') {
            return 'root';
        }
        const suffixes: { [index: string]: string } = {
            '2': 'nd', '3': 'rd', '4': 'th', '5': 'th', '6': 'th', '7': 'th'
        };
        let text = this.name
            .replace('b', '\u266D')
            .replace('#', '\u266F');
        return text + suffixes[this.name.charAt(this.name.length - 1)];
    }

}
