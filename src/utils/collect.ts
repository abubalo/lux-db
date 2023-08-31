import { Comparator, Matcher, KeyChain } from "../../types"
import { where } from "./where";

export const collect = <T, R> (done: (res: Array<Matcher<T>>) => R)=>{
    const matchers: Array<Matcher <T>> = [];

    const run = async () => done(matchers);

    return {
        where: where<T, R>((key: KeyChain<T>, comparator : Comparator, value) =>{
            matchers.push({key, comparator, value})
        }, run), 
        run
    }
}
