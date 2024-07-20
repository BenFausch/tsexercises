/*

Intro:

    Our attempt to Open Source didn't work quite as
    expected. It turned out there were already many
    existing functional JS libraries.

    All the remaining developers left the company as
    well. It seems that they are joining a very
    ambitious startup which re-invented a juicer and
    raised millions of dollars.
    Too bad we cannot compete with this kind of
    financing even though we believe our idea is
    great.

    It's time to shine for the last time and publish
    our new invention: object-constructor as our CTO
    named it. A small library which helps
    manipulating an object.

Exercise:

    Here is a library which helps manipulating objects.
    We tried to write type annotations and we failed.
    Please help!

*/

/*
- Create a type ObjectWithNewProp
    type ObjectWithNewProp
- Accepts a generic obje/*ct T
- Accepts a Key(string)/*
- Accepts a Value/*
    <T, K extends string, V> 
- Returns the Object T, tha/*t is merged with the New Key(NK):V(value)
    = T & {[NK in K]: V};
*/
type ObjectWithNewProp<T, K extends string, V> = T & {[NK in K]: V};

//Create a class that accepts an object with generic type T
export class ObjectManipulator<T> {

    //Constructor is a protected object, defined as the object T
    constructor(protected obj: T) {}

    /*
    - Create a method 'set'
        public set
    - Takes a string key K, and a value V
        <K extends string, V>(key: K, value: V)
    - Creates Object manipulator class that returns a newly created obj
        :ObjectManipulator
    - Which is the return type defined through ObjectWithNewProp 
    - In other words, this is a typing function that returns a new type     
        <ObjectWithNewProp<T, K, V>> {
    */
    public set<K extends string, V>(key: K, value: V): ObjectManipulator<ObjectWithNewProp<T, K, V>> {
        return new ObjectManipulator({...this.obj, [key]: value} as ObjectWithNewProp<T, K, V>);
    }

    // Simply gets a key:value pair, G is defined as a Key from T, returns Key G in the Object T
    public get<G extends keyof T>(key:G):T[G] {
        return this.obj[key];
    }

    /*
    define a method delete
        public delete
    accepts a key K that is a keyof object T
        <K extends keyof T>
    argument key is key K
        (key: K)
    return is a newly manipulated object
        : ObjectManipulator<Omit<T, K>> {
    */
    public delete<K extends keyof T>(key: K): ObjectManipulator<Omit<T, K>> {
        const newObj = {...this.obj};
        delete newObj[key];
        return new ObjectManipulator(newObj);
    }

    // return the object sent into this class as object T
    public getObject(): T {
        return this.obj;
    }
}
