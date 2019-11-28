import $ from "jquery";

export class Drill {
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

    setInstruction(text: string) {
        $('#drill-text').text(text);
    }
}
