import React, { ChangeEvent, KeyboardEvent } from "react"

export class UI extends React.Component<UIProps, UIState> {

    state: UIState = { shown: false, interval: 5000 }

    prevInterval: number = 5000

    hideTimeout: any = 0

    hidePreventors: number = 0

    didMount: boolean = false

    progressBarElapsed: HTMLDivElement | null = null;
    progressBarPending: HTMLDivElement | null = null;

    animations: (Animation | undefined)[] = []

    constructor(props: UIProps) {
        super(props)
    }

    render() {

        let interval = this.state.interval
        if (typeof (interval) === "number")
            interval /= 1000

        return (
            <div className="ui-root">
                <button className={`nav-button ui-button ${this.getHiddenClass()}`} id="prev-button" onClick={this.props.onPrevClick} onMouseEnter={this.addHidePreventor} onMouseLeave={this.removeHidePreventor} />
                <button className={`nav-button ui-button ${this.getHiddenClass()}`} id="next-button" onClick={this.props.onNextClick} onMouseEnter={this.addHidePreventor} onMouseLeave={this.removeHidePreventor} />
                <button className={`ui-button ${this.getHiddenClass()} ${this.props.paused ? "pause" : "play"}`} id="pause-button" onClick={this.props.onPausePlayClick} onMouseEnter={this.addHidePreventor} onMouseLeave={this.removeHidePreventor} />
                <input className={`ui-button ${this.getHiddenClass()}`} type="range" id="interval-slider" min={0.75} max={30} />
                <input
                    className={`ui-button ${this.getHiddenClass()}`}
                    type="number"
                    id="interval-input"
                    value={interval}
                    onFocus={this.addHidePreventor}
                    onBlur={() => {
                        this.removeHidePreventor()
                        this.intervalChanged()
                    }}
                    onMouseEnter={this.addHidePreventor}
                    onMouseLeave={this.removeHidePreventor}
                    onChange={this.intervalInputChanged}
                    onKeyDown={this.intervalInputKeyDown}
                />
                <div className={"progress-bar"} id="progress-bar-elapsed" ref={ref => this.progressBarElapsed = ref} />
                <div className={"progress-bar"} id="progress-bar-pending" ref={ref => this.progressBarPending = ref} />
            </div>
        )
    }

    public restartProgressBar(duration: number) {
        const keyframes: Keyframe[] = [
            {
                width: "100%"
            },
            {
                width: "0%"
            }
        ]

        this.animations = []

        this.animations.push(this.progressBarPending?.animate(keyframes, { duration: duration, fill: "none" }))
        this.animations.push(this.progressBarElapsed?.animate(keyframes, { duration: duration, direction: "reverse", fill: "none" }))
    }

    public pauseProgressBar() {
        for (const animation of this.animations) {
            animation?.pause()
        }
    }

    public resumeProgressBar() {
        for (const animation of this.animations) {
            animation?.play()
        }
    }

    getHiddenClass = () => this.state.shown ? "" : "ui-hidden"

    componentDidMount() {
        document.addEventListener("mousemove", this.hideUI)
    }

    intervalInputKeyDown(args: KeyboardEvent<HTMLInputElement>) {
        if (args.key == "Enter")
            (args.nativeEvent.target as HTMLInputElement).blur()
    }

    intervalInputChanged = (args: ChangeEvent<HTMLInputElement>) => {
        let interval: number | string = ""
        if (args.target.value)
            interval = +args.target.value * 1000
        this.setState({ interval: interval })
    }

    intervalChanged = () => {
        let interval = +this.state.interval
        interval = Math.max(this.props.minInterval ?? 0, interval)
        if (interval == this.prevInterval) return
        this.prevInterval = interval
        this.setState({ interval: interval })
        this.props.onIntervalChange?.(interval)
    }

    addHidePreventor = () => {
        window.clearTimeout(this.hideTimeout)
        this.hidePreventors++
    }

    removeHidePreventor = () => {
        this.hidePreventors--
        this.hideUI()
    }

    hideUI = () => {

        if (this.hidePreventors) return

        window.clearTimeout(this.hideTimeout)

        this.setState({ shown: true })

        this.hideTimeout = setTimeout(() => {
            this.setState({ shown: false })
        }, 500);
    }
}

export interface UIProps {
    onNextClick?: () => void
    onPrevClick?: () => void
    onPausePlayClick?: () => void
    onIntervalChange?: (newInterval: number) => void
    paused: boolean
    minInterval?: number
}

interface UIState {
    shown: boolean
    interval: number | string
}
