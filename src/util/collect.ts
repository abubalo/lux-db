import { Comparator, Matcher } from "../types/types"
import { where } from "./where";
import { KeyChain } from "../types/types";

export const collect = <T, R> (done: (res: Array<Matcher<T>>) => R)=>{
    const matchers: Array<Matcher <T>> = [];

    const run = async () => done(matchers);

    return {
        where: where<T, R>(collector: (key: KeyChain<T>, comparator : Comparator, value: unknown) =>{
            matchers.push({key, comparator, value})
        }, run), 
        run
    }
}