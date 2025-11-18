// src/services/ffishService.ts
import Module from 'ffish-es6';

// --- Type Definitions for ffish library ---
// Based on the official test.js file.
export interface FfishLibrary {
    Board: new (variant: string) => FfishBoard;
    loadVariantConfig: (configString: string) => void;
}
export interface FfishBoard {
    delete: () => void;
    fen: () => string;
    setFen: (fen: string) => void;
    legalMoves: () => string;
    push: (uciMove: string) => boolean;
    pop: () => void;
    isCheck: () => boolean;
    isGameOver: () => boolean;
    result: () => string;
    turn: () => boolean; // true for white, false for black
}
// We don't use the Engine, so we can remove its types for now.
export interface Engine {}

let ffishLibraryPromise: Promise<FfishLibrary> | null = null;

export const getFfishLibrary = (): Promise<FfishLibrary> => {
    if (!ffishLibraryPromise) {
        console.log('Loading ffish-es6 module...');
        ffishLibraryPromise = new (Module as any)().then(async (ffish: FfishLibrary) => {
            try {
                console.log('Fetching variants.ini...');
                const response = await fetch('/stockfish/variants.ini');
                if (!response.ok) {
                    throw new Error(`Failed to fetch variants.ini: ${response.statusText}`);
                }
                const iniContent = await response.text();
                console.log('Loading custom variant config...');
                ffish.loadVariantConfig(iniContent);
                console.log('Custom variant config loaded.');
                return ffish;
            } catch (error) {
                console.error('Error loading custom variant config:', error);
                throw error;
            }
        });
    }
    return ffishLibraryPromise;
};
