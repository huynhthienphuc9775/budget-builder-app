import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatMomentDateModule,
    ReactiveFormsModule,
  ],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  encapsulation: ViewEncapsulation.None,
})
export class DateRangePickerComponent {
  @Output() sendMonths = new EventEmitter<any>();
  public start = new FormControl(moment().month(0))
  public end = new FormControl(moment());

  ngOnInit(): void {
    this.start.valueChanges.subscribe((newValue) => {
      this.sendMonths.emit({
        start: newValue?.format('MM/YYYY'),
        end: this.end.value?.format('MM/YYYY'),
      });
    });

    this.end.valueChanges.subscribe((newValue) => {
      this.sendMonths.emit({
        start: this.start.value?.format('MM/YYYY'),
        end: newValue?.format('MM/YYYY'),
      });
    });
  }


  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>,
    controlKey: 'start' | 'end'
  ): void {
    const control = controlKey === 'start' ? this.start : this.end;
    const ctrlValue = control.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    control.setValue(ctrlValue);
    datepicker.close();
  }

}
