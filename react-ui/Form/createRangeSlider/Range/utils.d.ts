import { TThumbOffsets, ITrackBackground, Direction } from './types';
export declare function isTouchEvent(event: TouchEvent & MouseEvent): number;
export declare function normalizeValue(value: number, index: number, min: number, max: number, step: number, allowOverlap: boolean, values: number[]): number;
export declare function relativeValue(value: number, min: number, max: number): number;
export declare function isVertical(direction: Direction): boolean;
export declare function checkBoundaries(value: number, min: number, max: number): void;
export declare function checkInitialOverlap(values: number[]): void;
export declare function getMargin(element: Element): {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
export declare function getPadding(element: Element): {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
export declare function translateThumbs(elements: Element[], offsets: TThumbOffsets): void;
export declare function translate(element: Element, x: number, y: number): void;
export declare const schd: (fn: Function) => (...args: any[]) => void;
export declare function replaceAt(values: number[], index: number, value: number): number[];
export declare function getTrackBackground({ values, colors, min, max, direction }: ITrackBackground): string;
export declare function voidFn(): void;
export declare function assertUnreachable(x: never): never;
