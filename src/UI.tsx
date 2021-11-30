import React from "react"

export class UI extends React.Component<UIProps, UIState> {

    state: UIState = { shown: false }

    hideTimeout: any = 0

    canHide: boolean = true

    didMount: boolean = false

    constructor(props: UIProps) {
        super(props)
    }

    render() {
        return (
            <div className="ui-root">
                <button className={`nav-button ui-button ${this.getHiddenClass()}`} id="prev-button" onClick={this.props.onPrevClick} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler} />
                <button className={`nav-button ui-button ${this.getHiddenClass()}`} id="next-button" onClick={this.props.onNextClick} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler} />
                <button className={`ui-button ${this.getHiddenClass()} ${this.props.paused ? "pause" : "play"}`} id="pause-button" onClick={this.props.onPausePlayClick} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler} />
            </div>
        )
    }

    getHiddenClass = () => this.state.shown ? "" : "ui-hidden"

    componentDidMount() {
        document.addEventListener("mousemove", this.mouseMoveHandler)
    }

    mouseEnterHandler = () => {
        window.clearTimeout(this.hideTimeout)
        this.canHide = false
    }

    mouseLeaveHandler = () => {
        this.canHide = true
    }

    mouseMoveHandler = () => {

        if (!this.canHide) return

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