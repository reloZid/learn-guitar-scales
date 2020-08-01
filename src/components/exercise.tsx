import React from "react";
import {Fretboard, FretboardSettings} from "./fretboard";
import {Scale} from "../model/scale";
import {FretboardData, FretboardPosition} from "../model/fretboard-data";
import {ScaleDegree} from "../model/scale-degree";
import {Note} from "../model/note";

export interface ExerciseController {
    validateAnswer(selection: FretboardData): boolean

    nextQuestion(): { question: string, degree: ScaleDegree, note: Note }
}

type Props = {
    fretboardSettings: FretboardSettings,
    scale: Scale,
    controller: ExerciseController,
    onSetup: () => void,
};

type State = {
    selection: FretboardData,
    question: string,
    degree: ScaleDegree,
    note: Note,
    wrongAnswer: boolean,
};

export class Exercise extends React.Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            wrongAnswer: false,
            selection: new FretboardData(),
            ...this.props.controller.nextQuestion(),
        };
    }

    render() {
        const pattern = new FretboardData();
        pattern.setScale(this.props.scale);
        pattern.clip(
            this.props.fretboardSettings.firstFret,
            this.props.fretboardSettings.lastFret,
            this.props.fretboardSettings.openStrings
        );

        return (
            <div id="exercise">
                <Fretboard
                    settings={this.props.fretboardSettings}
                    data={this.state.selection}
                    pattern={pattern}
                    onClick={this.onClickNote.bind(this)}
                />
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Exercise</h5>
                        <div id="exercise-content">
                            <div id="exercise-text">
                                {!this.state.wrongAnswer && this.state.question}
                                {this.state.wrongAnswer && (
                                    <span className="wrong"><strong>Wrong!</strong> Try again.</span>
                                )}
                            </div>
                            {!this.state.wrongAnswer && (
                                <div id="exercise-buttons">
                                    <button type="submit" className="btn btn-secondary" onClick={this.onSetup.bind(this)}>
                                        Setup
                                    </button>
                                    <button type="submit" className="btn btn-primary" onClick={this.onNext.bind(this)}>
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private onClickNote(position: FretboardPosition) {
        const newSelection = this.state.selection.clone();
        if (this.state.selection.getContent(position)) {
            newSelection.clearContent(position);
        } else {
            newSelection.setContent(position, {degree: this.state.degree, note: this.state.note});
        }
        this.setState({selection: newSelection});
    }

    private onNext() {
        if (this.props.controller.validateAnswer(this.state.selection)) {
            this.setState({
                selection: new FretboardData(),
                ...this.props.controller.nextQuestion()
            });
        } else {
            this.setState({wrongAnswer: true});
            setTimeout(() => this.setState({wrongAnswer: false}), 1500);
        }
    }

    private onSetup() {
        this.props.onSetup();
    }
}
