import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import "@fortawesome/fontawesome-free/css/all.css"
import "../style.css"

import React from "react";
import ReactDOM from "react-dom";
import {FretboardSettings} from "./fretboard";
import {FretboardData} from "../model/fretboard-data";
import {Scale} from "../model/scale";
import {ExerciseId, Setup} from "./setup";
import {Exercise, ExerciseController} from "./exercise";
import {MarkDegreeOnStringExercise} from "../exercises/mark-degree-on-string-exercise";
import {MarkDegreeExercise} from "../exercises/mark-degree-exercise";

type State = {
    mode: 'setup' | ExerciseId,
    scale: Scale,
    fretboardSettings: FretboardSettings,
    fretboardData: FretboardData,
}

export class Main extends React.Component<{}, State> {
    constructor(props: Readonly<{}>) {
        super(props);

        const initialData = new FretboardData(Setup.getDefaultScale());
        initialData.setScale();

        this.state = {
            mode: 'setup',
            scale: Setup.getDefaultScale(),
            fretboardSettings: Setup.getDefaultFretboardSettings(),
            fretboardData: initialData,
        };
    }

    render() {
        return (
            <div className="container">
                <h1>Learn Guitar Scales</h1>
                {this.renderContent()}
            </div>
        );
    }

    renderContent() {
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

    onFretboardSettingsChanged(fretboardSettings: FretboardSettings) {
        this.setState({fretboardSettings});
    }

    onScaleChanged(scale: Scale) {
        const fretboardData = new FretboardData(scale);
        fretboardData.setScale();
        this.setState({scale, fretboardData});
    }

    onStart(exercise: ExerciseId) {
        this.setState({mode: exercise});
    }

    onSetup() {
        this.setState({mode: "setup"});
    }
}

ReactDOM.render(<Main/>, document.getElementById('root'));
