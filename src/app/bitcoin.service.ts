import { environment } from './../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Entry } from './entry';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable()
export class BitcoinService {
    constructor(private http: HttpClient) {}

    fetchHistory(currency: string) {
        return this.http
        .get(environment.bitcoinURL + `historical/close.json?currency=${currency}`)
        .pipe(
            map(responseData => {
                const entryArray: Entry[] = [];
                const bpi = responseData[`bpi`];
                for (const key in bpi) {
                    if (bpi.hasOwnProperty(key)) {
                        entryArray.push({ currencyDate: new Date(key), currencyValue: bpi[key]});
                    }
                }
                return entryArray;
            })
        );
    }

    fetchCurrent(currency: string) {
        return this.http
        .get(environment.bitcoinURL + `currentprice/${currency}.json`)
        .pipe(
            map(responseData => {
                const currentEntry: any = {};
                currentEntry[`currencyDate`] = new Date(responseData[`time`][`updated`]);
                currentEntry[`currencyValue`] = responseData[`bpi`][currency][`rate_float`];
                return currentEntry;
            })
        );
    }
    mergeApiCalls(currency: string) {
        const historyObservable = this.fetchHistory(currency);
        const currentObservable = this.fetchCurrent(currency);
        return forkJoin([historyObservable, currentObservable])
        .pipe(
            map(responseData => {
                let finalEntryArray: Entry[] = [];
                finalEntryArray = responseData[0];
                finalEntryArray.push(responseData[1]);
                finalEntryArray.reverse();
                return finalEntryArray.slice(0, 14);
            })
        );
    }
}
