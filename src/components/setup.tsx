import React from "react";
import {Fretboard, FretboardSettings} from "./fretboard";
import {Scale} from "../model/scale";
import {Note} from "../model/note";
import {ScaleDegree} from "../model/scale-degree";
import {FretboardData} from "../model/fretboard-data";

const scales: { [index: string]: string[] } = {
    'minor-pentatonic': ['1', 'b3', '4', '5', 'b7'],
    'major-pentatonic': ['1', '2', '3', '5', '6'],
    'minor-arpeggio': ['1', 'b3', '5'],
    'major-arpeggio': ['1', '3', '5'],
    'ionian': ['1', '2', '3', '4', '5', '6', '7'],
    'dorian': ['1', '2', 'b3', '4', '5', '6', 'b7'],
    'phrygian': ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
    'lydian': ['1', '2', '3', '#4', '5', '6', '7'],
    'mixolydian': ['1', '2', '3', '4', '5', '6', 'b7'],
    'aeolian': ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    'locrian': ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
    'chromatic': ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
};

export type ExerciseId = "mark-degree" | "mark-degree-on-string";

type Props = {
    fretboardSettings: FretboardSettings,
    onFretboardSettingsChanged: (fretboardSettings: FretboardSettings) => void,
    scale: Scale,
    onScaleChanged: (scale: Scale) => void,
    onStart: (exercise: ExerciseId) => void,
}

export class Setup extends React.Component<Props> {
    static getDefaultFretboardSettings(): FretboardSettings {
        return {
            firstFret: 5,
            lastFret: 8,
            openStrings: false,
            labels: 'scale-degrees',
        }
    };

    static getDefaultScale(): Scale {
        return new Scale(
            Note.fromName("A"),
            scales['minor-pentatonic'].map(name => ScaleDegree.fromName(name)),
            'minor-pentatonic',
        );
    }

    private inputs = {
        exercise: React.createRef<HTMLSelectElement>(),
        scale: React.createRef<HTMLSelectElement>(),
        root: React.createRef<HTMLSelectElement>(),
        firstFret: React.createRef<HTMLSelectElement>(),
        lastFret: React.createRef<HTMLSelectElement>(),
        openStrings: React.createRef<HTMLInputElement>(),
        showDegrees: React.createRef<HTMLInputElement>(),
    };

    render() {
        const rootNoteOptions = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
        const fretOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

        const form = (
            <form>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="select-exercise">Exercise</label>
                            <select className="form-control"
                                    id="select-exercise"
                                    ref={this.inputs.exercise}>
                                <option value="mark-degree">Mark Degree</option>
                                <option value="mark-degree-on-string">Mark Degree On String</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="select-scale">Scale</label>
                            <select className="form-control"
                                    id="select-scale"
                                    ref={this.inputs.scale}
                                    value={this.props.scale.name}
                                    onChange={this.onScaleChanged.bind(this)}>
                                <option value="major-arpeggio">Major Arpeggio</option>
                                <option value="minor-arpeggio">Minor Arpeggio</option>
                                <option value="major-pentatonic">Major Pentatonic</option>
                                <option value="minor-pentatonic">Minor Pentatonic</option>
                                <option value="ionian">Ionian</option>
                                <option value="dorian">Dorian</option>
                                <option value="phrygian">Phrygian</option>
                                <option value="lydian">Lydian</option>
                                <option value="mixolydian">Mixolydian</option>
                                <option value="aeolian">Aeolian</option>
                                <option value="locrian">Locrian</option>
                                <option value="chromatic">Chromatic</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="select-root">Root Note</label>
                            <select className="form-control"
                                    id="select-root"
                                    ref={this.inputs.root}
                                    value={this.props.scale.root.name}
                                    onChange={this.onScaleChanged.bind(this)}>
                                {rootNoteOptions.map(value => <option key={value}>{value}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="select-first-fret">First Fret</label>
                            <select className="form-control"
                                    id="select-first-fret"
                                    ref={this.inputs.firstFret}
                                    value={this.props.fretboardSettings.firstFret}
                                    onChange={this.onFretboardSettingsChanged.bind(this)}>
                                {fretOptions.map(value => <option key={value}>{value}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="select-last-fret">Last Fret</label>
                            <select className="form-control"
                                    id="select-last-fret"
                                    ref={this.inputs.lastFret}
                                    value={this.props.fretboardSettings.lastFret}
                                    onChange={this.onFretboardSettingsChanged.bind(this)}>
                                {fretOptions.map(value => <option key={value}>{value}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Options</label>
                            <div className="form-check">
                                <input type="checkbox"
                                       className="form-check-input"
                                       id="check-open-strings"
                                       ref={this.inputs.openStrings}
                                       checked={this.props.fretboardSettings.openStrings}
                                       onChange={this.onFretboardSettingsChanged.bind(this)}/>
                                <label className="form-check-label" htmlFor="check-open-strings">Include Open
                                    Strings</label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox"
                                       className="form-check-input"
                                       id="check-show-degrees"
                                       ref={this.inputs.showDegrees}
                                       checked={this.props.fretboardSettings.labels === "scale-degrees"}
                                       onChange={this.onFretboardSettingsChanged.bind(this)}/>
                                <label className="form-check-label" htmlFor="check-show-degrees">Show Scale
                                    Degrees</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <button type="submit" className="btn btn-primary" id="button-start"
                                onClick={this.onStart.bind(this)}>
                            Start
                        </button>
                    </div>
                </div>
            </form>
        );

        let fretboardData = new FretboardData(this.props.scale)
            .setScale()
            .clip(this.props.fretboardSettings);

        return (
            <div id="setup">
                <Fretboard
                    settings={this.props.fretboardSettings}
                    data={fretboardData}
                />

                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Setup</h5>
                        {form}
                    </div>
                </div>
            </div>
        );
    }

    private onFretboardSettingsChanged() {
        if (this.inputs.firstFret.current && this.inputs.lastFret.current && this.inputs.showDegrees.current && this.inputs.openStrings.current) {
            this.props.onFretboardSettingsChanged({
                firstFret: parseInt(this.inputs.firstFret.current.value),
                lastFret: parseInt(this.inputs.lastFret.current.value),
                labels: this.inputs.showDegrees.current.checked ? "scale-degrees" : "notes",
                openStrings: this.inputs.openStrings.current.checked,
            });
        }
    }

    private onScaleChanged() {
        if (this.inputs.root.current && this.inputs.scale.current) {
            this.props.onScaleChanged(new Scale(
                Note.fromName(this.inputs.root.current.value),
                scales[(this.inputs.scale.current.value)].map(name => ScaleDegree.fromName(name)),
                this.inputs.scale.current.value,
            ));
        }
    }

    private onStart() {
        if (this.inputs.exercise.current) {
            this.props.onStart(this.inputs.exercise.current.value as ExerciseId);
        }
    }
}
