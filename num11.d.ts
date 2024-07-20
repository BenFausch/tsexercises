/*

Intro:

    In order to engage users in the communication with
    each other we have decided to decorate usernames
    in various ways. A brief search led us to a library
    called "str-utils". Bad thing is that it lacks
    TypeScript declarations.

Exercise:

    Check str-utils module implementation at:
    node_modules/str-utils/index.js
    node_modules/str-utils/README.md

    Provide type declaration for that module in:
    declarations/str-utils/index.d.ts

    Try to avoid duplicates of type declarations,
    use type aliases.

*/


// in index.d.ts:
declare module 'str-utils' {
    // export const ...
    // export function ...
    
    export function strReverse(value:string):string;
    export function strToLower(value:string):string;
    export function strToUpper(value:string):string;
    export function strInvertCase(value:string):string;
    export function strRandomize(value:string):string;
    

}

// which can be simplified to:
declare module 'str-utils' {
    // export const ...
    // export function ...

    type StrFunType = (input: string) => string;
    
    export const strReverse:StrFunType;
    export const strToLower:StrFunType;
    export const strToUpper:StrFunType;
    export const strInvertCase:StrFunType;
    export const strRandomize:StrFunType;
    

}

