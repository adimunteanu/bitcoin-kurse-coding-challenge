import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Entry } from './entry';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

const historyApiURL = 'https://api.coindesk.com/v1/bpi/historical/close.json?currency=EUR';
const currentApiURL = 'https://api.coindesk.com/v1/bpi/currentprice/EUR.json';

@Injectable()
export class BitcoinService {
    constructor(private http: HttpClient) {}

    fetchHistory() {
        return this.http
        .get(historyApiURL)
        .pipe(
            map(responseData => {
                const entryArray: Entry[] = [];
                const bpi = responseData['bpi'];
                for(const key in bpi) {
                    if(bpi.hasOwnProperty(key)) {
                        entryArray.push({ currencyDate: new Date(key), currencyValue: bpi[key]});
                    }
                }
                return entryArray;
            })
        );
    }

    fetchCurrent() {
        return this.http
        .get(currentApiURL)
        .pipe(
            map(responseData => {
                let currentEntry: any = {};
                currentEntry['currencyDate'] = new Date(responseData['time']['updated']);
                currentEntry['currencyValue'] = responseData['bpi']['EUR']['rate_float'];
                return currentEntry;
            })
        );
    }
    mergeApiCalls() {
        let historyObservable = this.fetchHistory();
        let currentObservable = this.fetchCurrent();
        return forkJoin([historyObservable, currentObservable])
        .pipe(
            map(responseData => {
                let finalEntryArray: Entry[] = [];
                finalEntryArray = responseData[0];
                finalEntryArray.push(responseData[1])
                finalEntryArray.reverse();
                return finalEntryArray.slice(0, 14);
            })
        );
    }
}
