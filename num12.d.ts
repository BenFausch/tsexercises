/*

Intro:

    We have so many users and admins in the database!
    CEO's father Jeff says that we are a BigData
    startup now. We have no idea what it means, but
    Jeff says that we need to do some statistics and
    analytics.

    We've ran a questionnaire within the team to
    figure out what do we know about statistics.
    The only person who filled it was our coffee
    machine maintainer. The answers were:

     * Maximums
     * Minumums
     * Medians
     * Averages

    We found a piece of code on stackoverflow and
    compiled it into a module `stats`. The bad
    thing is that it lacks type declarations.

Exercise:

    Check stats module implementation at:
    node_modules/stats/index.js
    node_modules/stats/README.md

    Provide type declaration for that module in:
    declarations/stats/index.d.ts

Higher difficulty bonus exercise:

    Avoid duplicates of type declarations.

*/

// in index.ts

const compareUsers = (a: User, b: User) => a.age - b.age;
...
console.log('Median user:');
logUser(getMedianElement(users, compareUsers));
console.log(` - was ${colorizeIndex(getMedianIndex(users, compareUsers))}th to register`);


// in index.js
function getMaxIndex(input, comparator) {
    if (input.length === 0) {
        return -1;
    }
    var maxIndex = 0;
    for (var i = 1; i < input.length; i++) {
        if (comparator(input[i], input[maxIndex]) > 0) {
            maxIndex = i;
        }
    }
    return maxIndex;
}


// in index.d.ts:
declare module 'stats' {
  
  type Comparitor<T> = (a: T, b: T) => number; 
  
  type IndexComparitor = <T>(input: T[], comparator: Comparitor<T>) => number;
  type ArrayComparitor = <T>(input: T[], comparator: Comparitor<T>)=> T|null;
  
      export const getMaxIndex:IndexComparitor;
      export const getMaxElement:ArrayComparitor;
  
      export const getMinIndex:IndexComparitor;
      export const getMinElement:ArrayComparitor;
  
      export const getMedianIndex:IndexComparitor;
      export const getMedianElement:ArrayComparitor;
  
      export const getAverageValue: <T>(input: T[], getValue: (item: T) => number) => number|null;    
  
      
  }
  