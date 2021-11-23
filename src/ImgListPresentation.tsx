import React from "react";
import { Presentation, SlideInfo, Slides } from "./Presentation";

export class ImgListPresentation extends React.Component<ImgListPresentationProps, ImgListPresentationState> {

    slides: Slides = [
        {
            alt: "",
            id: 0,
            src: ""
        },
        {
            alt: "",
            id: 1,
            src: ""
        },
        {
            alt: "",
            id: 2,
            src: ""
        }
    ]

    prevIndex?: number

    constructor(props: ImgListPresentationProps) {
        super(props)
    }

    render() {

        for (const slideInfo of this.slides) {
            slideInfo.alt = this.props.imgAlt
        }

        this.adjustSlides()

        return (
            <Presentation slides={this.slides} slideDuration={(this.props.slideDuration ?? 750) + "ms"} />
        )
    }

    adjustSlides = () => {
        const index = this.props.index - (this.props.baseIndex ?? 0)
        const indexDif = index - (this.prevIndex ?? index)
        this.prevIndex = index
        if (indexDif == 1)
            this.moveSlidesForward()
        else if (indexDif == -1)
            this.moveSlidesBack()
        this.applySrc(index)
    }

    applySrc = (index: number) => {
        let i = index - 1
        for (const slideInfo of this.slides) {
            slideInfo.src = this.props.images[i] ?? ""
            i++
        }
    }

    moveSlidesForward = () => {
        let next = this.slides.shift() as SlideInfo
        this.slides.push(next)
    }

    moveSlidesBack = () => {
        let next = this.slides.pop() as SlideInfo
        this.slides.unshift(next)
    }
}

export interface ImgListPresentationProps {
    images: (string | undefined)[],
    index: number,
    baseIndex?: number,
    imgAlt: string,
    slideDuration?: number
}

interface ImgListPresentationState {

}