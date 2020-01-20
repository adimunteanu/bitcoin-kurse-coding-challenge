import { BitcoinService } from './bitcoin.service';
import { Component, OnInit } from '@angular/core';
import { Entry } from './entry';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BitcoinService]
})
export class AppComponent implements OnInit {
  title = 'bitcoin-kurse-coding-challenge';

  constructor(private bitcoinService: BitcoinService) {}

  dataEntries: Entry[] = [];

  ngOnInit() {
    this.bitcoinService.mergeApiCalls().subscribe(entries => this.dataEntries = entries);
  }
}
