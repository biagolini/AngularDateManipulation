import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

/** @title Date range picker forms integration */
@Component({
  selector: 'date-range-picker-forms-example',
  templateUrl: 'date-range-picker-forms-example.html',
})
export class DateRangePickerFormsExample implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  stringDate = new FormControl();
  numberDay = new FormControl('DD');
  numberWeek = new FormControl('WW');

  convertedToText: any = '';

  ngOnInit(): void {
    this.range.get('start')?.valueChanges.subscribe((data) => {
      let formattedDt = formatDate(data, 'yyyy-MM-dd', 'en_US');
      this.convertedToText = formattedDt;
    });
  }

  calcDifDay() {
    // CALCULATE NUMBER O MS IN A DAY
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    let start = this.range.value.start;
    let end = this.range.value.end;
    return (end - start) / _MS_PER_DAY;
  }

  dayCalc() {
    // ref: https://stackoverflow.com/a/15289883/4678899
    // SET A DATE BY YYYY-MM-DD STRING
    let date = this.stringDate.value;
    const [year, month, day] = date.split('-');
    const choosedDate = new Date();
    choosedDate.setDate(+day);
    choosedDate.setFullYear(+year);
    choosedDate.setMonth(+month - 1);

    // CALCULATE NUMBER O MS IN A DAY
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // SET AN OBJECT WITH JANUARY FIRST OF THE CURRENT YEAR
    const firstJan = new Date(choosedDate.getFullYear(), 0, 1);
    const utc1 = Date.UTC(
      choosedDate.getFullYear(),
      choosedDate.getMonth(),
      choosedDate.getDate()
    );
    const utc2 = Date.UTC(
      firstJan.getFullYear(),
      firstJan.getMonth(),
      firstJan.getDate()
    );
    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
  }

  updateDays() {
    const nDays = this.dayCalc();
    this.numberDay.setValue(nDays);
  }

  updateWeek() {
    let nDays = this.dayCalc();
    let nWeeks = Math.floor(nDays / 7);
    this.numberWeek.setValue(nWeeks);
  }
}
