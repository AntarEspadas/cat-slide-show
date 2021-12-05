import React from "react"

export class UI extends React.Component<UIProps, UIState> {

    state: UIState = { shown: false }

    hideTimeout: any = 0

    hidePreventors: number = 0

    didMount: boolean = false

    constructor(props: UIProps) {
        super(props)
    }

    render() {
        return (
            <div className="ui-root">
                <button className={`nav-button ui-element ${this.getHiddenClass()}`} id="prev-button" onClick={this.props.onPrevClick} onMouseEnter={this.addHidePreventor} onMouseLeave={this.removeHidePreventor} />
                <button className={`nav-button ui-element ${this.getHiddenClass()}`} id="next-button" onClick={this.props.onNextClick} onMouseEnter={this.addHidePreventor} onMouseLeave={this.removeHidePreventor} />
                <button className={`ui-element ${this.getHiddenClass()} ${this.props.paused ? "pause" : "play"}`} id="pause-button" onClick={this.props.onPausePlayClick} onMouseEnter={this.addHidePreventor} onMouseLeave={this.removeHidePreventor} />
                <input className={`ui-element ${this.getHiddenClass()}`} type="range" id="interval-slider" />
                <input className={`ui-element ${this.getHiddenClass()}`} type="number" id="interval-input" onFocus={this.addHidePreventor} onBlur={this.removeHidePreventor} onMouseEnter={this.addHidePreventor} onMouseLeave={this.removeHidePreventor} />
            </div>
        )
    }

    getHiddenClass = () => this.state.shown ? "" : "ui-hidden"

    componentDidMount() {
        document.addEventListener("mousemove", this.hideUI)
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
    paused: boolean
}

interface UIState {
    shown: boolean
}