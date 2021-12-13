import React, { MouseEvent } from "react"
import ReactDOM from "react-dom"
import { Presentation, SlideInfo, Slides } from "./Presentation"
import { CatApiGetter, ImageGetter, CataasGetter, DanbooruImageGetter } from "./ImageGetters"
import { UI } from "./UI"
import Visibility from "visibilityjs"
import { ImgListPresentation } from "./ImgListPresentation"
import { Timeout } from "./Timeout"

class App extends React.Component<AppProps, AppState> {

    state: AppState = {
        index: 0,
        images: [],
        ready: false,
        paused: false
    }
    catGetter: ImageGetter = new DanbooruImageGetter()

    canMoveForward = true
    canMoveBack = true

    slideDuration = 750

    timeout: Timeout | undefined
    intervalDuration: number = 5000

    ui: UI | null = null;

    constructor(props: AppProps) {
        super(props)
    }

    componentDidMount() {
        Promise.all([this.catGetter.get(), this.catGetter.get(), this.catGetter.get()]).then(images => {
            this.setState(state => {
                return {
                    ready: true,
                    images: state.images.concat(images),
                    index: 0
                }
            })
        })
        this.timeout = new Timeout(this.intervalDuration, this.headForward)
        this.ui?.restartProgressBar(this.intervalDuration)
    }

    render() {
        return (
            <>
                {
                    this.state.ready
                        ? <ImgListPresentation
                            slideDuration={this.slideDuration}
                            imgAlt={"cat"}
                            index={this.state.index}
                            images={this.state.images}
                            onMouseDown={this.pause}
                            onMouseUp={this.play}
                        />
                        : <></>
                }
                <UI
                    onPrevClick={this.headBack}
                    onNextClick={this.headForward}
                    onPausePlayClick={this.pausePlayHandler}
                    paused={this.state.paused}
                    onIntervalChange={interval => this.setTimeInterval(interval)}
                    minInterval={100}
                    ref={ref => this.ui = ref} />
            </>
        )
    }

    headForward = () => {

        if (!this.canMoveForward) return
        this.canMoveForward = false
        setTimeout(() => {
            this.canMoveForward = true
            this.setTimeInterval(this.intervalDuration)
            if (this.state.paused)
                this.pause()
        }, this.slideDuration);


        if (this.state.index + 2 >= this.state.images.length)
            this.catGetter.get().then(image => {
                this.setState(state => {
                    const images = [...state.images]
                    images.push(image)
                    return { images: images }
                })
            })
        this.setState(state => {
            return { index: state.index + 1 }
        })
    }

    headBack = () => {

        if (!this.canMoveBack) return
        this.canMoveBack = false

        setTimeout(() => {
            this.canMoveBack = true
        }, this.slideDuration);

        if (this.state.index <= 0) return
        this.pause();
        this.setState(state => {
            return { index: state.index - 1 }
        })
    }

    setTimeInterval(interval: number) {
        this.intervalDuration = interval
        if (!this.canMoveForward) return
        this.timeout?.stop()
        this.timeout = new Timeout(this.intervalDuration, this.headForward)
        this.ui?.restartProgressBar(this.intervalDuration)
    }

    pausePlayHandler = () => {
        this.state.paused
            ? this.play()
            : this.pause()
    }

    handleClick = (event: MouseEvent) => {
        console.log(event)
    }

    pause = () => {
        if (this.timeout?.state == "running") {
            this.timeout?.pause()
        }
        this.setState({ paused: true })
        this.ui?.pauseProgressBar()
    }

    play = () => {
        this.setState({ paused: false })
        if (this.timeout?.state == "paused") {
            this.timeout?.resume()
        }
        this.ui?.resumeProgressBar()
    }
}

interface AppState {
    index: number,
    images: string[]
    ready: boolean,
    paused: boolean
}

interface AppProps {
    imageGetters: { [key: string]: ImageGetter }
}

const imageGetters = {
    "The Cat API": new CatApiGetter(),
    "Cats as a Service": new CataasGetter()
}

ReactDOM.render(
    <React.StrictMode>
        <App imageGetters={imageGetters} />
    </React.StrictMode>,
    document.getElementById("root")
)