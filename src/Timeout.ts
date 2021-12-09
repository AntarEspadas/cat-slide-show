import Visibility from "visibilityjs"

export class Timeout {

    _timeoutId: number

    _state: TimeoutState

    _startTime: number

    _timeRemaining: number

    _userCallback: Function

    constructor(timeout: number, callback: Function) {
        this._userCallback = callback
        this._timeoutId = visibilityTimeout(timeout, this.callback)
        this._startTime = Date.now()
        this._timeRemaining = timeout
        this._state = "running"
    }

    callback = () => {
        this._userCallback()
        this._state = "stopped"
    }

    public stop() {
        Visibility.stop(this._timeoutId)
        this._state = "stopped"
    }

    public pause() {
        if (this._state == "stopped")
            throw new Error("Timeout has already been stopped")
        if (this._state == "paused")
            throw new Error("Timeout already paused");

        let elapsed = Date.now() - this._startTime
        this._timeRemaining = this._timeRemaining - elapsed
        Visibility.stop(this._timeoutId)
        this._state = "paused"
    }

    public resume() {
        if (this._state == "stopped")
            throw new Error("Timeout has already been stopped");
        if (this._state == "running")
            throw new Error("Timeout already running");

        this._startTime = Date.now()
        this._timeoutId = visibilityTimeout(this._timeRemaining, this.callback)
        this._state = "running"
    }

    public get state(): TimeoutState {
        return this._state
    }


}

export function visibilityTimeout(timeout: number, callback: Function) {
    const id = Visibility.every(timeout, () => {
        Visibility.stop(id)
        callback()
    })
    return id
}

type TimeoutState = "running" | "paused" | "stopped"
