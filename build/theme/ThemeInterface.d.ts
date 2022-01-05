import { TextStyle } from 'react-native';
import { DeepPartial } from '../utility-types';
export interface Palette {
    main: string;
    contrastText: string;
}
export declare type Typography = Pick<TextStyle, 'fontFamily' | 'fontWeight' | 'fontSize' | 'lineHeight' | 'letterSpacing'>;
export interface ThemeInterface {
    palette: {
        primary: Palette;
        evenCellBg: string;
        oddCellBg: string;
        nowIndicator: string;
        gray: {
            100: string;
            200: string;
            300: string;
            500: string;
            800: string;
        };
    };
    isRTL: boolean;
    typography: {
        fontFamily?: string;
        xs: Typography;
        sm: Typography;
        xl: Typography;
    };
    eventCellOverlappings: readonly Palette[];
}
export declare type PartialTheme = DeepPartial<ThemeInterface>;
