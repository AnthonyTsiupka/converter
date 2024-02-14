import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.sass'],
})
export class ConverterComponent implements OnInit {
  converterForm: FormGroup = this.fb.group({
    amount: 1,
    fromCurrency: 'UAH',
    toCurrency: 'USD',
  });
  exchangeRates: any;
  convertedAmount!: number;

  private ngUnsubscibe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.getExchangeRates();

    this.converterForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscibe$))
      .subscribe(() => {
        this.getExchangeRates();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscibe$.next();
    this.ngUnsubscibe$.complete();
  }

  getExchangeRates() {
    this.currencyService
      .getExchangeRates(this.converterForm.controls['fromCurrency'].value)
      .subscribe((data) => {
        this.exchangeRates = data;
        this.convertCurrency();
      });
  }

  convertCurrency(): void {
    const amount = this.converterForm.controls['amount'].value;
    const toCurrency = this.converterForm.controls['toCurrency'].value;

    this.convertedAmount = amount * this.exchangeRates.rates[toCurrency];
  }
}
