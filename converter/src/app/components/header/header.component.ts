import { Component, OnInit } from '@angular/core';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit {
  usdToUah!: number;
  eurToUah!: number;

  private ngUnsubscibe$ = new Subject<void>();

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    forkJoin(
      this.currencyService.getExchangeRates('EUR'),
      this.currencyService.getExchangeRates('USD')
    )
      .pipe(takeUntil(this.ngUnsubscibe$))
      .subscribe((data) => {
        this.eurToUah = data[0].rates['UAH'];
        this.usdToUah = data[1].rates['UAH'];
      });
  }

  ngOnDestroy() {
    this.ngUnsubscibe$.next();
    this.ngUnsubscibe$.complete();
  }
}
