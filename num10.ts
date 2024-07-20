/*

Intro:

    We have asynchronous functions now, advanced technology.
    This makes us a tech startup officially now.
    But one of the consultants spoiled our dreams about
    inevitable future IT leadership.
    He said that callback-based asynchronicity is not
    popular anymore and everyone should use Promises.
    He promised that if we switch to Promises, this would
    bring promising results.

Exercise:

    We don't want to reimplement all the data-requesting
    functions. Let's decorate the old callback-based
    functions with the new Promise-compatible result.
    The final function should return a Promise which
    would resolve with the final data directly
    (i.e. users or admins) or would reject with an error
    (or type Error).

    The function should be named promisify.

Higher difficulty bonus exercise:

    Create a function promisifyAll which accepts an object
    with functions and returns a new object where each of
    the function is promisified.

    Rewrite api creation accordingly:

        const api = promisifyAll(oldApi);

*/

interface User {
    type: 'user';
    name: string;
    age: number;
    occupation: string;
}

interface Admin {
    type: 'admin';
    name: string;
    age: number;
    role: string;
}

type Person = User | Admin;

const admins: Admin[] = [
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' }
];

const users: User[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' }
];

export type ApiResponse<T> = (
    {
        status: 'success';
        data: T;
    } |
    {
        status: 'error';
        error: string;
    }
);

/*
//create function that has callback which has response type function, takes generic
type CallbackBasedAsyncFunction<T>
 // param callback is defined
 = (callback: 
 // typing foor callback is a response function that returns void
 (response:ApiResponse<T>)=> void) 
 // CallbackBasedAsyncFunction returns void
 => void;
*/

type CallbackBasedAsyncFunction<T> = (callback:(response:ApiResponse<T>)=>void)=>void;

//create promise based async function
type PromiseBasedAsyncFunction<T> = () => Promise<T>;


// //create function promisify, takes generic
// export function promisify<T>
// //takes CallbackBasedAsyncFunction as an arg, which itself takes the generic
// (fn: CallbackBasedAsyncFunction<T>): 
// //returns a PromiseBasedAsyncFunction that accepts the generic
// PromiseBasedAsyncFunction<T> {
// //Define promise function
//     return () => new Promise<T>((resolve, reject) => {
//         fn((response) => {
//             if (response.status === 'success') {
//                 resolve(response.data);
//             } else {
//                 reject(new Error(response.error));
//             }
//         });
//     });
// }

export function promisify<T>(fn: CallbackBasedAsyncFunction<T>) : PromiseBasedAsyncFunction<T>{
    return()=> new Promise<T>((resolve,reject)=>{
        fn((response)=> {
            if (response.status==='success'){
                resolve(response.data);
            }else{
                reject(new Error(response.error));
            }
        })
    });
}

/*old
export function promisify(arg: unknown): unknown {
    return null;
}*/

const oldApi = {
    requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
        callback({
            status: 'success',
            data: admins
        });
    },
    requestUsers(callback: (response: ApiResponse<User[]>) => void) {
        callback({
            status: 'success',
            data: users
        });
    },
    requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
        callback({
            status: 'success',
            data: Date.now()
        });
    },
    requestCoffeeMachineQueueLength(callback: (response: ApiResponse<number>) => void) {
        callback({
            status: 'error',
            error: 'Numeric value has exceeded Number.MAX_SAFE_INTEGER.'
        });
    }
};
//create an api that promisifies all the oldAPI



  export const api = promisifyAll(oldApi);


type SourceObject<T> = {[K in keyof T]: CallbackBasedAsyncFunction<T[K]>};
type PromisifiedObject<T> = {[K in keyof T]: PromiseBasedAsyncFunction<T[K]>};

// //create function promisifyAll, 
// export function promisifyAll
// //Typing is a generic that extends a anonymous object with key:values in it (oldApi)
// <T extends {[key: string]: any}>
// //Parameter is a SourceObject that takes the generic (oldApi)
// (obj: SourceObject<T>): 
// //Returns a promisified object that has the generic (oldApi)
// PromisifiedObject<T> {
// //Result is a partial piece of the promisified object (oldApi)
//     const result: Partial<PromisifiedObject<T>> = {};
// // loop through the object's keys, casting they keys as an array of keys of the generic oldApi
//     for (const key of Object.keys(obj) as (keyof T)[]) {
// // convert items in generic oldApi into a promisified version
//         result[key] = promisify(obj[key]);
//     }
// // cast result as a promisified object, which is a promisified function created from oldApi
//     return result as PromisifiedObject<T>;
// }


export function promisifyAll<T extends {[key:string]:any}>(obj: SourceObject<T>):PromisifiedObject<T>{
    const result: Partial<PromisifiedObject<T>>={};
    for(const key of Object.keys(obj) as Array<keyof T>){
        result[key] = promisify(obj[key])
    }
    return result as PromisifiedObject<T>;
}

// old version
// export const api = {
//     requestAdmins: promisify(oldApi.requestAdmins),
//     requestUsers: promisify(oldApi.requestUsers),
//     requestCurrentServerTime: promisify(oldApi.requestCurrentServerTime),
//     requestCoffeeMachineQueueLength: promisify(oldApi.requestCoffeeMachineQueueLength)
// };

function logPerson(person: Person) {
    console.log(
        ` - ${person.name}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`
    );
}

async function startTheApp() {
    console.log('Admins:');
    (await api.requestAdmins()).forEach(logPerson);
    console.log();

    console.log('Users:');
    (await api.requestUsers()).forEach(logPerson);
    console.log();

    console.log('Server time:');
    console.log(`   ${new Date(await api.requestCurrentServerTime()).toLocaleString()}`);
    console.log();

    console.log('Coffee machine queue length:');
    console.log(`   ${await api.requestCoffeeMachineQueueLength()}`);
}

startTheApp().then(
    () => {
        console.log('Success!');
    },
    (e: Error) => {
        console.log(`Error: "${e.message}", but it's fine, sometimes errors are inevitable.`);
    }
);

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/generics.html
