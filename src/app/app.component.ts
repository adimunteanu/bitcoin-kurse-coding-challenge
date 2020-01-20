import { BitcoinService } from './bitcoin.service';
import { Component, OnInit } from '@angular/core';
import { Entry } from './entry';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private bitcoinService: BitcoinService) {}

  dataEntries: Entry[] = [];

  ngOnInit() {
    this.bitcoinService.mergeApiCalls('EUR').subscribe(entries => this.dataEntries = entries);
  }
}
