import { HorizontalDirection } from '../interfaces';
export declare function usePanResponder({ onSwipeHorizontal, }: {
    onSwipeHorizontal?: (d: HorizontalDirection) => void;
}): import("react-native").PanResponderInstance;
