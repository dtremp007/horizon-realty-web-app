export default class NavTracker {
    private user_has_made_pitstop;

    constructor() {
        this.user_has_made_pitstop = false;
    }

    userMadePitstop() {
        return this.user_has_made_pitstop;
    }

    userWasHere() {
        this.user_has_made_pitstop = true;
    }
}
