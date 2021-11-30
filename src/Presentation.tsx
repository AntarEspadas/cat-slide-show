import React from "react";

export class Presentation extends React.Component<
  PresentationProps,
  PresentationState
> {
  state: PresentationState = {};

  prevSlideProps?: SlideProps[];

  hidden = [false, false, false];

  render() {
    const slideProps = this.getProps();
    this.prevSlideProps = slideProps;
    return (
      <div className="presentation">
        <Slide
          src={slideProps[0].src}
          alt={slideProps[0].alt}
          offset={slideProps[0].offset}
          hidden={slideProps[0].hidden}
          slideDuration={slideProps[0].slideDuration}
        />
        <Slide
          src={slideProps[1].src}
          alt={slideProps[1].alt}
          offset={slideProps[1].offset}
          hidden={slideProps[1].hidden}
          slideDuration={slideProps[1].slideDuration}
        />
        <Slide
          src={slideProps[2].src}
          alt={slideProps[2].alt}
          offset={slideProps[2].offset}
          hidden={slideProps[2].hidden}
          slideDuration={slideProps[2].slideDuration}
        />
      </div>
    );
  }

  getProps = () => {
    const slides = this.props.slides;
    let info: SlideProps[] = [];
    for (let index = 0; index < slides.length; index++) {
      const slideInfo = slides[index];
      let offset = index - 1;
      this.calculateHidden(offset, slideInfo.id);
      info[slideInfo.id] = {
        src: slideInfo.src,
        alt: slideInfo.alt,
        slideDuration: this.props.slideDuration,
        offset: offset,
        hidden: this.hidden[slideInfo.id],
      };
    }
    return info;
  };

  calculateHidden = (currentOffset: number, id: number) => {
    if (this.prevSlideProps == undefined) return false;
    let previousOffset = this.prevSlideProps[id].offset;
    let dif = Math.abs(currentOffset - previousOffset);
    if (dif == 0) return this.hidden[id];
    this.hidden[id] = dif >= 2;
  };
}

export function Slide(props: SlideProps) {
  let style = {
    "--offset": 100 * props.offset + "%",
    "--slideDuration": props.slideDuration,
  } as React.CSSProperties;
  return (
    <div
      className="slide"
      style={{
        ...style,
        zIndex: props.hidden ? -100 : 0,
        transition: props.hidden
          ? "all 0ms none"
          : `transform ${props.slideDuration} ease-in-out`,
      }}
    >
      <div className="slide-wrapper" style={{ backgroundColor: "white" }}>
        <img className="bg" src={props.src} alt={props.alt} />
      </div>
      <div className="slide-wrapper">
        <img className="main" src={props.src} alt={props.alt} />
      </div>
    </div>
  );
}

export interface SlideProps {
  src: string;
  alt: string;
  offset: number;
  hidden: boolean;
  slideDuration: string;
}

export interface SlideInfo {
  src: string;
  alt: string;
  id: 0 | 1 | 2;
}

export interface PresentationProps {
  slides: Slides;
  slideDuration: string;
}

export type Slides = [SlideInfo, SlideInfo, SlideInfo];

interface PresentationState {
  prevSlideProps?: SlideProps[];
  slideProps?: SlideProps[];
}
