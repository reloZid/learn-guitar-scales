import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import "@fortawesome/fontawesome-free/css/all.css"
import "../style.css"

import React from "react";
import ReactDOM from "react-dom";
import {FretboardSettings} from "./fretboard";
import {Scale, ScaleSettings} from "../model/scale";
import {ExerciseId, Setup} from "./setup";
import {Exercise, ExerciseController} from "./exercise";
import {MarkDegreeOnStringExercise} from "../exercises/mark-degree-on-string-exercise";
import {MarkDegreeExercise} from "../exercises/mark-degree-exercise";

type SerializableState = {
    scaleSettings: ScaleSettings,
    fretboardSettings: FretboardSettings,
}

type State = {
    mode: 'setup' | ExerciseId,
    scale: Scale,
    fretboardSettings: FretboardSettings,
}

export class Main extends React.Component<{}, State> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.restoreState();
    }

    render() {
        return (
            <div className="container">
                <h1>Learn Guitar Scales</h1>
                {this.renderContent()}
            </div>
        );
    }

    private renderContent() {
        if (this.state.mode === "setup") {
            return (
                <Setup
                    fretboardSettings={this.state.fretboardSettings}
                    scale={this.state.scale}
                    onFretboardSettingsChanged={this.onFretboardSettingsChanged.bind(this)}
                    onScaleChanged={this.onScaleChanged.bind(this)}
                    onStart={this.onStart.bind(this)}
                />
            );
        } else {
            const controllerFactories: {[index: string]: () => ExerciseController} = {
                "mark-degree": () => new MarkDegreeExercise(this.state.fretboardSettings, this.state.scale),
                "mark-degree-on-string": () => new MarkDegreeOnStringExercise(this.state.fretboardSettings, this.state.scale),
            };
            return (
                <Exercise
                    fretboardSettings={this.state.fretboardSettings}
                    scale={this.state.scale}
                    controller={controllerFactories[this.state.mode]()}
                    onSetup={this.onSetup.bind(this)}
                />
            );

        }
    }

    componentDidUpdate(): void {
        this.saveState();
    }

    private onFretboardSettingsChanged(fretboardSettings: FretboardSettings) {
        this.setState({fretboardSettings});
    }

    private onScaleChanged(scale: Scale) {
        this.setState({scale});
    }

    private onStart(exercise: ExerciseId) {
        this.setState({mode: exercise});
    }

    private onSetup() {
        this.setState({mode: "setup"});
    }

    private saveState() {
        const state: SerializableState = {
            scaleSettings: this.state.scale.settings,
            fretboardSettings: this.state.fretboardSettings,
        };

        window.localStorage.setItem('main-state', JSON.stringify(state));
    }

    private restoreState() {
        try {
            const state = JSON.parse(window.localStorage.getItem('main-state') as string) as SerializableState;

            this.state = {
                mode: 'setup',
                scale: new Scale(state.scaleSettings),
                fretboardSettings: state.fretboardSettings,
            }
        } catch (e) {
            this.state = {
                mode: 'setup',
                scale: Setup.getDefaultScale(),
                fretboardSettings: Setup.getDefaultFretboardSettings(),
            };
        }
    }
}

ReactDOM.render(<Main/>, document.getElementById('root'));
