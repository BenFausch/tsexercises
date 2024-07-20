/*

Intro:

    The next logical step for us is to provide more
    precise registration date for our users and admins.
    We've approximately made up dates for each user and
    admin and used a library called "date-wizard" in
    order to pretty-format the dates.

    Unfortunately, type declarations which came with
    "date-wizard" library were incomplete.

    1. DateDetails interface is missing
       time related fields such as hours, minutes and
       seconds.
    2. Function "pad" is exported but not declared.

Exercise:

    Check date-wizard module implementation at:
    node_modules/date-wizard/index.js
    node_modules/date-wizard/index.d.ts

    Extend type declaration of that module in:
    module-augmentations/date-wizard/index.d.ts

*/

// in index.ts
let num = `#${dateWizard.pad(index + 1)}`;



// in index.d.ts:
// This enables module augmentation mode.
import 'date-wizard';

declare module 'date-wizard' {
    // Add your module extensions here.
    interface DateDetails {
        year: number;
            month: number;
            date: number;
            hours: number;
            minutes: number;
            seconds: number;
    }

   const pad: (index:number)=>string;
}