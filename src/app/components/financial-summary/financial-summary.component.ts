import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-summary.component.html',
  styleUrls: ['./financial-summary.component.scss'],
})
export class FinancialSummaryComponent implements OnChanges {
  @Input() budgets!: Record<string, any>;
  @Input() income!: Record<string, number>;
  @Input() months!: string[];
  @Input() initialOpeningBalance: number = 0;
  
  public totalExpenses: Record<string, number> = {};
  public profitLoss: Record<string, number> = {};
  public openingBalance: Record<string, number> = {};
  public closingBalance: Record<string, number> = {};

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateBalances();
  }

  calculateBalances(): void {
    let previousClosingBalance = this.initialOpeningBalance;

    for (const month of this.months) {
      // Tính Total Expenses
      let expenses = 0;
      for (const group in this.budgets) {
        for (const sub in this.budgets[group]) {
          expenses += this.budgets[group][sub][month] || 0;
        }
      }
      this.totalExpenses[month] = expenses;

      // Tính Profit/Loss
      this.profitLoss[month] =
        (this.income[month] || 0) - this.totalExpenses[month];

      // Tính Opening Balance
      this.openingBalance[month] = previousClosingBalance;

      // Tính Closing Balance
      this.closingBalance[month] =
        this.openingBalance[month] + this.profitLoss[month];

      // Cập nhật Closing Balance làm Opening Balance cho tháng tiếp theo
      previousClosingBalance = this.closingBalance[month];
    }
  }
}
