import $ from "jquery";

export class DrillMenu {
    private text: string = "";

    constructor() {
        $('#button-next').on('click', event => event.preventDefault());
    }

    onNext(callback: () => void) {
        $('#button-next').on('click', callback);
    }

    show() {
        $('#drill').show();
    }

    hide() {
        $('#drill').hide();
    }

    question(text: string) {
        this.text = text;
        $('#drill-text').text(text);
    }

    correct(callback: () => void) {
        const container = $('#drill-text');
        container.html('<span class="correct"><strong>Correct!</strong></span>');
        setTimeout(callback, 1000);
    }

    wrongTryAgain() {
        const container = $('#drill-text');
        container.html('<span class="wrong"><strong>Wrong!</strong> Try again.</span>');
        setTimeout(() => container.text(this.text), 1500);
    }
}
