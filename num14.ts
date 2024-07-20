/*

Intro:

    For some unknown reason most of our developers left
    the company. We need to actively hire now.
    In the media we've read that companies that invent
    and publish new technologies attract more potential
    candidates. We need to use this opportunity and
    invent and publish some npm packages. Following the
    new trend of functional programming in JS we
    decided to develop a functional utility library.
    This will put us on the bleading edge since we are
    pretty much sure no one else did anything similar.
    We also provided some jsdoc along with the
    functions, but it might sometimes be inaccurate.

Exercise:

    Provide proper typing for the specified functions.

Bonus:

    Could you please also refactor the code to reduce
    code duplication?
    You might need some excessive type casting to make
    it really short.

*/

//  _ __   _____      __
// | '_ \ / _ \ \ /\ / /
// | | | |  __/\ V  V /
// |_| |_|\___| \_/\_/


/*
function toFunctional
- generic type T extends function type, sent as an argument, returns a Function type
    <T extends Function>(func: T): Function {
*/
function toFunctional<T extends Function>(func: T): Function {
    
    //Get argument count
    const fullArgCount = func.length;
    
    /*
    function createSubFunction
        - takes curried arguments as an unknown array (unknown b/c its variable)
        - builds out arguments list recursively, eventually applying all of them once built
        - honestly this might be better as a simple for instead of a recursive, but it's a neat implementation
    */
    function createSubFunction(curriedArgs: unknown[]) {
        // returns a function, this referring to this function, defined as an obj
        // function is empty and generic at this time, is built out below
        return function(this: Function) {

            // arguments is the built-in arguments obj, pulled in from createSubFunction
            // combine parent's curriedArgs with the current arguments for this
            const newCurriedArguments = curriedArgs.concat(Array.from(arguments));
            
            //recursion stop
            if (newCurriedArguments.length > fullArgCount) {
                throw new Error('Too many arguments');
            }
            //actually applies the function once the arg list is filled
            if (newCurriedArguments.length === fullArgCount) {
                return func.apply(this, newCurriedArguments);
            }
            //recursive call to add more arguments
            return createSubFunction(newCurriedArguments);
        };
    }
    return createSubFunction([]);
}


// interface for mapper function, set up for recursion
interface MapperFunc<I, O> {
    (): MapperFunc<I, O>;
    (input: I[]): O[];
}

// interface for mapFunc, overloaded mapper with recursion added in rows 2/3
interface MapFunc {
    (): MapFunc;
    <I, O>(mapper: (item: I) => O): MapperFunc<I, O>;
    <I, O>(mapper: (item: I) => O, input: I[]): O[];
}

/**
 * 2 arguments passed: returns a new array
 * which is a result of input being mapped using
 * the specified mapper.
 *
 * 1 argument passed: returns a function which accepts
 * an input and returns a new array which is a result
 * of input being mapped using original mapper.
 *
 * 0 arguments passed: returns itself.
 */

/*
- create map const
    export const map = 
- set to create function
    toFunctional(
- generic I input, O output for toFunctional
    <I, O>
- arg list for toFunction is (fn, input)
- where fn returns output O, and input is an input array I
    (fn: (arg: I) => O, input: I[]) 
- returning a mapped input, cast as MapFunc
    => input.map(fn)) as MapFunc;
*/
export const map = toFunctional(<I, O>(fn: (arg: I) => O, input: I[]) => input.map(fn)) as MapFunc;



interface FiltererFunc<I> {
    (): FiltererFunc<I>;
    (input: I[]): I[];
}

interface FilterFunc {
    (): FilterFunc;
    <I>(filterer: (item: I) => boolean): FiltererFunc<I>;
    <I>(filterer: (item: I) => boolean, input: I[]): I[];
}

/**
 * 2 arguments passed: returns a new array
 * which is a result of input being filtered using
 * the specified filter function.
 *
 * 1 argument passed: returns a function which accepts
 * an input and returns a new array which is a result
 * of input being filtered using original filter
 * function.
 *
 * 0 arguments passed: returns itself.
 */
export const filter = toFunctional(<I>(fn: (item: I) => boolean, input: I[]) => input.filter(fn)) as FilterFunc;

interface ReducerInitialFunc<I, O> {
    (): ReducerInitialFunc<I, O>;
    (input: I[]): O;
}

interface ReducerFunc<I, O> {
    (): ReducerFunc<I, O>;
    (initialValue: O): ReducerInitialFunc<I, O>;
    (initialValue: O, input: I[]): O;
}

interface ReduceFunc {
    (): ReduceFunc;
    <I, O>(reducer: (acc: O, val: I) => O): ReducerFunc<I, O>;
    <I, O>(reducer: (acc: O, val: I) => O, initialValue: O): ReducerInitialFunc<I, O>;
    <I, O>(reducer: (acc: O, val: I) => O, initialValue: O, input: I[]): O;
}

/**
 * 3 arguments passed: reduces input array it using the
 * specified reducer and initial value and returns
 * the result.
 *
 * 2 arguments passed: returns a function which accepts
 * input array and reduces it using previously specified
 * reducer and initial value and returns the result.
 *
 * 1 argument passed: returns a function which:
 *   * when 2 arguments is passed to the subfunction, it
 *     reduces the input array using specified initial
 *     value and previously specified reducer and returns
 *     the result.
 *   * when 1 argument is passed to the subfunction, it
 *     returns a function which expects the input array
 *     and reduces the specified input array using
 *     previously specified reducer and inital value.
 *   * when 0 argument is passed to the subfunction, it
 *     returns itself.
 *
 * 0 arguments passed: returns itself.
 */



export const reduce = toFunctional(
    <I, O>(reducer: (acc: O, item: I) => O, initialValue: O, input: I[]) => input.reduce(reducer, initialValue)
) as ReduceFunc;

interface ArithmeticArgFunc {
    (): ArithmeticArgFunc;
    (b: number): number;
}

interface ArithmeticFunc {
    (): ArithmeticFunc;
    (a: number): ArithmeticArgFunc;
    (a: number, b: number): number;
}

/**
 * 2 arguments passed: returns sum of a and b.
 *
 * 1 argument passed: returns a function which expects
 * b and returns sum of a and b.
 *
 * 0 arguments passed: returns itself.
 */
export const add = toFunctional((a: number, b: number) => a + b) as ArithmeticFunc;

/**
 * 2 arguments passed: subtracts b from a and
 * returns the result.
 *
 * 1 argument passed: returns a function which expects
 * b and subtracts b from a and returns the result.
 *
 * 0 arguments passed: returns itself.
 */
export const subtract = toFunctional((a: number, b: number) => a - b) as ArithmeticFunc;

interface PropNameFunc<K extends string> {
    (): PropNameFunc<K>;
    <O extends {[key in K]: O[K]}>(obj: O): O[K];
}

interface PropFunc {
    (): PropFunc;
    <K extends string>(propName: K): PropNameFunc<K>;
    <O, K extends keyof O>(propName: K, obj: O): O[K];
}

/**
 * 2 arguments passed: returns value of property
 * propName of the specified object.
 *
 * 1 argument passed: returns a function which expects
 * propName and returns value of property propName
 * of the specified object.
 *
 * 0 arguments passed: returns itself.
 */
export const prop = toFunctional(<O, K extends keyof O>(obj: O, propName: K): O[K] => obj[propName]) as PropFunc;

type F<A extends unknown[], R> = (...args: A) => R;
type TR<I, O> = (arg: I) => O;

interface PipeFunc {
    (): PipeFunc;
    <A1 extends unknown[], R1>(f: F<A1, R1>): (...args: A1) => R1;
    <A1 extends unknown[], R1, R2>(f: F<A1, R1>, tr1: TR<R1, R2>): (...args: A1) => R2;
    <A1 extends unknown[], R1, R2, R3>(f: F<A1, R1>, tr1: TR<R1, R2>, tr2: TR<R2, R3>): (...args: A1) => R3;
    <A1 extends unknown[], R1, R2, R3, R4>(
        f: F<A1, R1>, tr1: TR<R1, R2>, tr2: TR<R2, R3>, tr3: TR<R3, R4>
    ): (...args: A1) => R4;
    <A1 extends unknown[], R1, R2, R3, R4, R5>(
        f: F<A1, R1>, tr1: TR<R1, R2>, tr2: TR<R2, R3>, tr3: TR<R3, R4>, tr4: TR<R4, R5>
    ): (...args: A1) => R5;
}

/**
 * >0 arguments passed: expects each argument to be
 * a function. Returns a function which accepts the
 * same arguments as the first function. Passes these
 * arguments to the first function, the result of
 * the first function passes to the second function,
 * the result of the second function to the third
 * function... and so on. Returns the result of the
 * last function execution.
 *
 * 0 arguments passed: returns itself.
 */
export const pipe: PipeFunc = function (...functions: Function[]) {
    if (arguments.length === 0) {
        return pipe;
    }
    return function subFunction() {
        let nextArguments = Array.from(arguments);
        let result;
        for (const func of functions) {
            result = func(...nextArguments);
            nextArguments = [result];
        }
        return result;
    };
};



//        _     _
//   ___ | | __| |
//  / _ \| |/ _` |
// | (_) | | (_| |
//  \___/|_|\__,_|

// /**
//  * 2 arguments passed: returns a new array
//  * which is a result of input being mapped using
//  * the specified mapper.
//  *
//  * 1 argument passed: returns a function which accepts
//  * an input and returns a new array which is a result
//  * of input being mapped using original mapper.
//  *
//  * 0 arguments passed: returns itself.
//  *
//  * @param {Function} mapper
//  * @param {Array} input
//  * @return {Array | Function}
//  */
// export function map(mapper, input) {
//     if (arguments.length === 0) {
//         return map;
//     }
//     if (arguments.length === 1) {
//         return function subFunction(subInput) {
//             if (arguments.length === 0) {
//                 return subFunction;
//             }
//             return subInput.map(mapper);
//         };
//     }
//     return input.map(mapper);
// }

// /**
//  * 2 arguments passed: returns a new array
//  * which is a result of input being filtered using
//  * the specified filter function.
//  *
//  * 1 argument passed: returns a function which accepts
//  * an input and returns a new array which is a result
//  * of input being filtered using original filter
//  * function.
//  *
//  * 0 arguments passed: returns itself.
//  *
//  * @param {Function} filterer
//  * @param {Array} input
//  * @return {Array | Function}
//  */
// export function filter(filterer, input) {
//     if (arguments.length === 0) {
//         return filter;
//     }
//     if (arguments.length === 1) {
//         return function subFunction(subInput) {
//             if (arguments.length === 0) {
//                 return subFunction;
//             }
//             return subInput.filter(filterer);
//         };
//     }
//     return input.filter(filterer);
// }

// /**
//  * 3 arguments passed: reduces input array it using the
//  * specified reducer and initial value and returns
//  * the result.
//  *
//  * 2 arguments passed: returns a function which accepts
//  * input array and reduces it using previously specified
//  * reducer and initial value and returns the result.
//  *
//  * 1 argument passed: returns a function which:
//  *   * when 2 arguments is passed to the subfunction, it
//  *     reduces the input array using specified initial
//  *     value and previously specified reducer and returns
//  *     the result.
//  *   * when 1 argument is passed to the subfunction, it
//  *     returns a function which expects the input array
//  *     and reduces the specified input array using
//  *     previously specified reducer and inital value.
//  *   * when 0 argument is passed to the subfunction, it
//  *     returns itself.
//  *
//  * 0 arguments passed: returns itself.
//  *
//  * @param {Function} reducer
//  * @param {*} initialValue
//  * @param {Array} input
//  * @return {* | Function}
//  */
// export function reduce(reducer:()=>[], initialValue:[], input:[]) {
//     if (arguments.length === 0) {
//         return reduce;
//     }
//     if (arguments.length === 1) {
//         return function subFunction(subInitialValue:[], subInput:[]) {
//             if (arguments.length === 0) {
//                 return subFunction;
//             }
//             if (arguments.length === 1) {
//                 return function subSubFunction(subSubInput:[]) {
//                     if (arguments.length === 0) {
//                         return subSubFunction;
//                     }
//                     return subSubInput.reduce(reducer, subInitialValue);
//                 };
//             }
//             return subInput.reduce(reducer,subInitialValue);
//         }
//     }
//     if (arguments.length === 2) {
//         return function subFunction(subInput:[]) {
//             if (arguments.length === 0) {
//                 return subFunction;
//             }
//             return subInput.reduce(reducer, initialValue);
//         };
//     }
//     return input.reduce(reducer, initialValue);
// }

// /**
//  * 2 arguments passed: returns sum of a and b.
//  *
//  * 1 argument passed: returns a function which expects
//  * b and returns sum of a and b.
//  *
//  * 0 arguments passed: returns itself.
//  *
//  * @param {Number} a
//  * @param {Number} b
//  * @return {Number | Function}
//  */
// export function add(a:number, b:number) {
//     if (arguments.length === 0) {
//         return add;
//     }
//     if (arguments.length === 1) {
//         return function subFunction(subB:number) {
//             if (arguments.length === 0) {
//                 return subFunction;
//             }
//             return a + subB;
//         };
//     }
//     return a + b;
// }

// /**
//  * 2 arguments passed: subtracts b from a and
//  * returns the result.
//  *
//  * 1 argument passed: returns a function which expects
//  * b and subtracts b from a and returns the result.
//  *
//  * 0 arguments passed: returns itself.
//  *
//  * @param {Number} a
//  * @param {Number} b
//  * @return {Number | Function}
//  */
// export function subtract(a:number, b:number) {
//     if (arguments.length === 0) {
//         return subtract;
//     }
//     if (arguments.length === 1) {
//         return function subFunction(subB:number) {
//             if (arguments.length === 0) {
//                 return subFunction;
//             }
//             return a - subB;
//         };
//     }
//     return a - b;
// }

// /**
//  * 2 arguments passed: returns value of property
//  * propName of the specified object.
//  *
//  * 1 argument passed: returns a function which expects
//  * propName and returns value of property propName
//  * of the specified object.
//  *
//  * 0 arguments passed: returns itself.
//  *
//  * @param {Object} obj
//  * @param {String} propName
//  * @return {* | Function}
//  */
// export function prop(obj:[], propName:number) {
//     if (arguments.length === 0) {
//         return prop;
//     }
//     if (arguments.length === 1) {
//         return function subFunction(subPropName:number) {
//             if (arguments.length === 0) {
//                 return subFunction;
//             }
//             return obj[subPropName];
//         };
//     }
//     return obj[propName];
// }

// /**
//  * >0 arguments passed: expects each argument to be
//  * a function. Returns a function which accepts the
//  * same arguments as the first function. Passes these
//  * arguments to the first function, the result of
//  * the first function passes to the second function,
//  * the result of the second function to the third
//  * function... and so on. Returns the result of the
//  * last function execution.
//  *
//  * 0 arguments passed: returns itself.
//  *
//  * TODO TypeScript
//  *   * Should properly handle at least 5 arguments.
//  *   * Should also make sure argument of the next
//  *     function matches the return type of the previous
//  *     function.
//  *
//  * @param {Function[]} functions
//  * @return {*}
//  */
// export function pipe(...functions:Array<()=>any>) {
//     if (arguments.length === 0) {
//         return pipe;
//     }
//     return function subFunction() {
//         let nextArguments = Array.from(arguments);
//         let result;
//         for (const func of functions) {
//             result = func(...nextArguments);
//             nextArguments = [result];
//         }
//         return result;
//     };
// }
