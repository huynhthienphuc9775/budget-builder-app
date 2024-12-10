import { Component } from '@angular/core';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { BudgetTableComponent } from './components/budget-table/budget-table.component';

@Component({
  selector: 'app-root',
  imports: [
    DateRangePickerComponent,
    BudgetTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  public months = { start: '01/2024', end: '12/2024' };


  receiveMonths(event: any) {
    this.months = event;
  }

}
