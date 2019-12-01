import $ from "jquery";

export class Drill {
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

    wrongTryAgain() {
        const container = $('#drill-text');
        container.html('<span class="wrong"><strong>Wrong!</strong> Try again.</span>');
        setTimeout(() => container.text(this.text), 2000);
    }
}
