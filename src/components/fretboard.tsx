import React from "react";

import {FretboardData, FretboardPosition} from "../model/fretboard-data";

let style = {
    maxFretSpacing: 120,
    stringSpacing: 55,
    markerSize: 30,
    noteSize: 40,
    openNoteSize: 35,
    scaleDegreeColors: [
        'black',
        'darkred',
        'firebrick',
        'darkgreen',
        'limegreen',
        'gold',
        'skyblue',
        'darkblue',
        'purple',
        'mediumpurple',
        'teal',
        'turquoise',
    ],
};

export interface FretboardSettings {
    firstFret: number,
    lastFret: number,
    openStrings: boolean,
    labels: 'notes' | 'scale-degrees',
    pattern: boolean,
}

type Props = {
    settings: FretboardSettings,
    data: FretboardData,
    pattern?: FretboardData,
    onClick?: (position: FretboardPosition) => void,
}

type State = {
    fretSpacing: number,
    additionalFrets: number,
}

export class Fretboard extends React.PureComponent<Props, State> {
    private container = React.createRef<HTMLDivElement>();

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            fretSpacing: 0,
            additionalFrets: 0,
        };

        this.updateDimensions = this.updateDimensions.bind(this);
    }

    render() {
        let firstFret = this.props.settings.firstFret - Math.floor(this.state.additionalFrets / 2);
        let lastFret = this.props.settings.lastFret + Math.ceil(this.state.additionalFrets / 2);

        while (firstFret < 1) {
            firstFret++;
            lastFret++;
        }

        const rows = [];
        for (let string = 0; string < FretboardData.getStringCount(); string++) {
            const cols = [];
            for (let fret = firstFret; fret < lastFret + 1; fret++) {
                cols.push(this.renderPosition({string, fret}, fret === firstFret));
            }
            rows.push(<tr key={string}>{cols}</tr>)
        }

        const tableStyle = {
            marginLeft: this.props.settings.openStrings ? style.openNoteSize : 0,
        };

        return (
            <div id="fretboard" ref={this.container}>
                <table style={tableStyle}>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        );
    }

    private renderPosition(position: FretboardPosition, isFirstFret: boolean) {
        const hasSingleMarker = [3, 5, 7, 9].includes(position.fret % 12) && position.string === 2;
        const hasDoubleMarker = position.fret % 12 === 0 && (position.string === 1 || position.string === 3);
        const hasOpenNote = isFirstFret && this.props.settings.openStrings;
        const openPosition = {string: position.string, fret: 0};

        const cellStyle = {
            width: this.state.fretSpacing,
            minWidth: this.state.fretSpacing,
            height: style.stringSpacing,
        };

        let className = "";
        if (position.fret < this.props.settings.firstFret || position.fret > this.props.settings.lastFret) {
            className = "inactive";
        }

        return (
            <td style={cellStyle} key={position.fret} className={className}>
                {(hasSingleMarker || hasDoubleMarker) && this.renderMarker()}
                {hasOpenNote && this.renderNote(openPosition)}
                {this.renderNote(position)}
            </td>
        );
    }

    private renderMarker() {
        const markerStyle = {
            left: this.state.fretSpacing / 2 - style.markerSize / 2,
            top: style.stringSpacing - style.markerSize / 2,
            width: style.markerSize,
            height: style.markerSize,
            borderRadius: style.markerSize / 2,
        };

        return <div className="marker" style={markerStyle}/>;
    }

    private renderNote(position: FretboardPosition) {
        const openNote = position.fret === 0;
        const content = this.props.data.getPosition(position);
        const patternContent = this.props.pattern && this.props.pattern.getPosition(position);
        const noteSize = openNote ? style.openNoteSize : style.noteSize;

        let contentStyle: { [index: string]: string | number | undefined } = {
            top: style.stringSpacing / 2 - noteSize / 2,
            width: noteSize,
            height: noteSize,
            borderRadius: noteSize / 2,
            lineHeight: (noteSize - 3) + 'px',
        };

        if (openNote) {
            contentStyle.left = -noteSize;
        } else {
            contentStyle.left = this.state.fretSpacing / 2 - noteSize / 2;
        }

        if (content) {
            contentStyle.backgroundColor = style.scaleDegreeColors[content.degree.value];
        }

        return (
            <div className={openNote ? "open-note" : "note"} onClick={() => this.onClick(position)}>
                {content && (
                    <div className="note-content" style={contentStyle}>
                        {this.props.settings.labels == "notes" ? content.note.name : content.degree.name}
                    </div>
                )}
                {!content && this.props.settings.pattern && patternContent && (
                    <div className="note-content note-pattern" style={contentStyle}/>
                )}
            </div>
        );
    }

    private onClick(position: FretboardPosition) {
        if (this.props.onClick) {
            this.props.onClick(position);
        }
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    componentDidUpdate() {
        this.updateDimensions();
    }

    private updateDimensions() {
        if (!this.container.current) {
            return;
        }

        let containerWidth = this.container.current.clientWidth;
        if (this.props.settings.openStrings) {
            containerWidth -= style.openNoteSize;
        }

        const fretCount = this.props.settings.lastFret - this.props.settings.firstFret + 1;
        let fretSpacing = containerWidth / fretCount;
        let additionalFrets = 0;

        while (fretSpacing > style.maxFretSpacing) {
            additionalFrets++;
            fretSpacing = containerWidth / (fretCount + additionalFrets);
        }

        this.setState({
            fretSpacing,
            additionalFrets,
        });
    }
}
