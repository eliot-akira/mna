import * as React from 'react';
import { IProps, Direction } from './types';
declare class Range extends React.Component<IProps> {
    static defaultProps: {
        step: number;
        direction: Direction;
        disabled: boolean;
        allowOverlap: boolean;
        min: number;
        max: number;
    };
    trackRef: any;
    schdOnMouseMove: (e: MouseEvent) => void;
    schdOnTouchMove: (e: TouchEvent) => void;
    schdOnEnd: (e: Event) => void;
    schdOnWindowResize: () => void;
    state: {
        draggedThumbIndex: number;
    };
    constructor(props: IProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: IProps): void;
    componentWillUnmount(): void;
    getOffsets: () => any[];
    getThumbs: () => {}[];
    getTargetIndex: (e: Event) => number;
    addTouchEvents: (e: TouchEvent) => void;
    addMouseEvents: (e: MouseEvent) => void;
    onMouseDownTrack: (e: any) => void;
    onWindowResize: () => void;
    onTouchStartTrack: (e: any) => void;
    onMouseOrTouchStart: (e: MouseEvent & TouchEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onKeyDown: (e: any) => void;
    onKeyUp: (e: any) => void;
    onMove: (clientX: number, clientY: number) => null | undefined;
    normalizeValue: (value: number, index: number) => number;
    onEnd: (e: Event) => void;
    render(): any;
}
export default Range;
