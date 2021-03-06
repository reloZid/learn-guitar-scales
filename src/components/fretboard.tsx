import React from "react";

import {FretboardContent, FretboardData, FretboardPosition} from "../model/fretboard-data";

const style = {
    maxFretSpacing: 120,
    stringSpacing: 55,
    markerSize: 30,
    noteSize: 40,
    openNoteSize: 35,
    topMargin: 30,
    fretWidth: 4,
    scaleDegreeColors: [
        'black',
        'darkred',
        'firebrick',
        'darkgreen',
        'limegreen',
        'goldenrod',
        'skyblue',
        'darkblue',
        'purple',
        'mediumpurple',
        'teal',
        'turquoise',
    ],
    patternBorder: 'black solid 2px',
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
    firstVisibleFret: number,
    lastVisibleFret: number,
}

export class Fretboard extends React.PureComponent<Props, State> {
    private readonly canvas = React.createRef<HTMLCanvasElement>();
    private readonly stringImage = new Image();

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            fretSpacing: 0,
            firstVisibleFret: 0,
            lastVisibleFret: 0,
        };

        this.stringImage.src = 'data:image/gif;base64,R0lGODdhAgAIAOMQAB0aFSUfDyooKTUxJkA6Gk9EJFlPLFRRSGtnZnNpUHRvXIF3bY+Ifp6Xh7Gunby4rywAAAAAAgAIAAAEDHAERV5xpiW20BFABAA7';
        this.stringImage.onload = () => this.forceUpdate();
    }

    render() {
        const canvasStyle = {
            width: '100%',
            height: style.stringSpacing * FretboardData.getStringCount() + style.topMargin,
        };

        return (
            <canvas
                id="fretboard"
                ref={this.canvas}
                style={canvasStyle}
                onClick={(evt) => this.onClick(evt.clientX, evt.clientY)}
            />
        );
    }

    componentDidMount() {
        this.updateDimensions();
        this.drawCanvas();

        window.addEventListener('resize', () => this.updateDimensions());
    }

    componentWillUnmount() {
        window.removeEventListener('resize', () => this.updateDimensions());
    }

    componentDidUpdate() {
        this.updateDimensions();
        this.drawCanvas();
    }

    private updateDimensions() {
        if (!this.canvas.current) {
            return;
        }

        let containerWidth = this.canvas.current.clientWidth;
        if (this.props.settings.openStrings) {
            containerWidth -= style.openNoteSize;
        }

        const fretCount = this.props.settings.lastFret - this.props.settings.firstFret + 1;
        let fretSpacing = (containerWidth - style.fretWidth) / fretCount;
        let additionalFrets = 0;

        while (fretSpacing > style.maxFretSpacing) {
            additionalFrets++;
            fretSpacing = (containerWidth - style.fretWidth) / (fretCount + additionalFrets);
        }

        let firstVisibleFret = this.props.settings.firstFret - Math.floor(additionalFrets / 2);
        let lastVisibleFret = this.props.settings.lastFret + Math.ceil(additionalFrets / 2);

        while (firstVisibleFret < 1) {
            firstVisibleFret++;
            lastVisibleFret++;
        }

        this.setState({
            fretSpacing,
            firstVisibleFret,
            lastVisibleFret,
        });
    }

    private drawCanvas() {
        if (!this.canvas.current) {
            return;
        }

        let ctx = this.canvas.current.getContext('2d');

        if (!ctx) {
            return;
        }

        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;

        if (this.props.settings.openStrings) {
            ctx.translate(style.openNoteSize, style.topMargin);
        } else {
            ctx.translate(0, style.topMargin);
        }

        this.drawFretboard(ctx);

        for (let string = 0; string < FretboardData.getStringCount(); string++) {
            if (this.props.settings.openStrings) {
                this.drawPosition(ctx, {fret: 0, string});
            }
            for (let fret = this.state.firstVisibleFret; fret <= this.state.lastVisibleFret; fret++) {
                this.drawPosition(ctx, {fret, string});
            }
        }
    }

    private drawFretboard(ctx: CanvasRenderingContext2D) {
        const fretboardWidth = (this.state.lastVisibleFret - this.state.firstVisibleFret + 1) * this.state.fretSpacing;
        const fretboardHeight = style.stringSpacing * FretboardData.getStringCount();

        // background
        ctx.fillStyle = 'bisque';
        ctx.fillRect(0, 0, fretboardWidth, fretboardHeight);

        // frets
        for (let i = 0; i <= this.state.lastVisibleFret - this.state.firstVisibleFret + 1; i++) {
            const fret = this.state.firstVisibleFret + i;

            if (fret === this.props.settings.firstFret || fret === this.props.settings.lastFret + 1) {
                ctx.fillStyle = 'black';
            } else {
                ctx.fillStyle = 'gray';
            }

            ctx.fillRect(i * this.state.fretSpacing, 0, 4, fretboardHeight);
        }

        // markers
        for (let i = 0; i <= this.state.lastVisibleFret - this.state.firstVisibleFret; i++) {
            let fret = this.state.firstVisibleFret + i;
            let drawMarkerText = false;
            let x = (i + 0.5) * this.state.fretSpacing;

            if ([3, 5, 7, 9].includes(fret % 12)) {
                ctx.fillStyle = 'gray';
                fillCircle(ctx, x, fretboardHeight / 2, style.markerSize / 2);
                drawMarkerText = true;
            }

            if (fret % 12 == 0) {
                ctx.fillStyle = 'gray';
                fillCircle(ctx, x, fretboardHeight / 3, style.markerSize / 2);
                fillCircle(ctx, x, fretboardHeight / 3 * 2, style.markerSize / 2);
                drawMarkerText = true;
            }

            if (drawMarkerText) {
                ctx.fillStyle = 'black';
                ctx.font = '24px Segoe UI';
                ctx.textAlign = 'center';
                ctx.fillText(String(fret), x, -8);
            }
        }

        // strings
        ctx.fillStyle = ctx.createPattern(this.stringImage, 'repeat-x') as CanvasPattern;
        ctx.save();
        ctx.translate(0, style.stringSpacing / 2 - this.stringImage.height / 2);
        for (let string = 0; string < FretboardData.getStringCount(); string++) {
            ctx.fillRect(0, 0, fretboardWidth, this.stringImage.height);
            ctx.translate(0, style.stringSpacing);
        }
        ctx.restore();
    }

    private drawPosition(ctx: CanvasRenderingContext2D, position: FretboardPosition) {
        const content = this.props.data.getContent(position);
        const pattern = this.props.pattern && this.props.pattern.getContent(position) !== undefined;

        if (!content && !pattern) {
            return;
        }

        ctx.save();

        if (position.fret === 0) {
            ctx.translate(-0.5 * style.openNoteSize + 2, (position.string + 0.5) * style.stringSpacing);
        } else {
            const visibleFretIndex = position.fret - this.state.firstVisibleFret;
            ctx.translate((visibleFretIndex + 0.5) * this.state.fretSpacing, (position.string + 0.5) * style.stringSpacing);
        }

        if (content) {
            this.drawContent(ctx, position, content);
        } else {
            this.drawPattern(ctx, position);
        }

        ctx.restore();
    }

    private drawContent(ctx: CanvasRenderingContext2D, position: FretboardPosition, content: FretboardContent) {
        ctx.fillStyle = style.scaleDegreeColors[content.degree.value];

        if (position.fret === 0) {
            fillCircle(ctx, 0, 0, style.openNoteSize / 2);
        } else {
            fillCircle(ctx, 0, 0, style.noteSize / 2);
        }

        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Segoe UI';
        ctx.textAlign = 'center';

        if (this.props.settings.labels === "notes") {
            ctx.fillText(content.note.name, 0, 8);
        }

        if (this.props.settings.labels === "scale-degrees") {
            ctx.fillText(content.degree.name, 0, 8);
        }
    }

    private drawPattern(ctx: CanvasRenderingContext2D, position: FretboardPosition) {
        if (!this.props.settings.pattern) {
            return;
        }

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        if (position.fret === 0) {
            strokeCircle(ctx, 0, 0, style.openNoteSize / 2);
        } else {
            strokeCircle(ctx, 0, 0, style.noteSize / 2);
        }
    }

    private onClick(x: number, y: number) {
        if (!this.props.onClick || !this.canvas.current) {
            return;
        }

        const rect = this.canvas.current.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;

        y -= style.topMargin;

        if (this.props.settings.openStrings) {
            x -= style.openNoteSize;
        }

        const string = Math.floor(y / style.stringSpacing);

        if (string < 0 || string >= FretboardData.getStringCount()) {
            return;
        }

        const fretIndex = Math.floor(x / this.state.fretSpacing);
        const openStringClicked = fretIndex < 0 && this.props.settings.openStrings;
        const fret = openStringClicked ? 0 : this.state.firstVisibleFret + fretIndex;

        this.props.onClick({fret,  string});
    }
}

function fillCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}

function strokeCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.stroke();
}
