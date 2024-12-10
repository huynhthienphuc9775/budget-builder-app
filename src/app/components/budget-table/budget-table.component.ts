import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  input,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { FinancialSummaryComponent } from '../financial-summary/financial-summary.component';

type SubBudget = Record<string, number>;
type BudgetGroup = Record<string, SubBudget>;

@Component({
  selector: 'app-budget-table',
  standalone: true,
  imports: [CommonModule, FormsModule, FinancialSummaryComponent],
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.scss'],
})
export class BudgetTableComponent {
  @Input() range!: { start: string; end: string };
  @ViewChildren('inputElement') inputs!: QueryList<ElementRef>;

  public income: Record<string, number> = {
    '02/2024': 1000,
    '03/2024': 1500,
    '04/2024': 1200,
    '05/2024': 1300,
  };

  public budgets: Record<string, BudgetGroup> = {
    'Cloud Hosting': {
      'sub1 of cloud hosting': {
        '02/2024': 200,
        '03/2024': 100,
      },
      'sub2 of cloud hosting': {
        '04/2024': 300,
        '05/2024': 400,
      },
    },
  };

  months: string[] = [];

  ngOnInit(): void {
    if (this.range) {
      this.months = this.getMonthsInRange(this.range.start, this.range.end);
    }
  }

  navigate(event: KeyboardEvent, rowIndex: number, colIndex: number): void {
    const inputsArray = this.inputs.toArray();
    const numRows = Object.keys(this.budgets).length; 
    const numCols = this.months.length; 
  
    const currentIndex = rowIndex * numCols + colIndex;
  
    let nextIndex = currentIndex;
  
    switch (event.key) {
      case 'ArrowUp':
        if (rowIndex > 0) {
          nextIndex = currentIndex - numCols;
        }
        break;
  
      case 'ArrowDown':
        if (rowIndex < numRows - 1) {
          nextIndex = currentIndex + numCols;
        }
        break;
  
      case 'ArrowLeft':
        if (colIndex > 0) {
          nextIndex = currentIndex - 1;
        }
        break;
  
      case 'ArrowRight':
        if (colIndex < numCols - 1) {
          nextIndex = currentIndex + 1;
        }
        break;
  
      default:
        return;
    }
  
    inputsArray[nextIndex]?.nativeElement.focus();
    event.preventDefault(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['range'] && changes['range'].currentValue) {
      this.months = this.getMonthsInRange(this.range.start, this.range.end);
    }
  }

  getMonthsInRange(start: string, end: string): string[] {
    const startDate = moment(start, 'MM/YYYY');
    const endDate = moment(end, 'MM/YYYY');

    const months: string[] = [];

    while (startDate.isSameOrBefore(endDate, 'month')) {
      months.push(startDate.format('MM/YYYY'));
      startDate.add(1, 'month');
    }

    return months;
  }

  // Update sub-budget key
  updateSubBudgetKey(group: string, oldKey: string, newKey: string): void {
    if (!newKey.trim() || newKey === oldKey) {
      return;
    }
    const groupBudgets = this.budgets[group];
    groupBudgets[newKey] = groupBudgets[oldKey];
    delete groupBudgets[oldKey];
  }

  // Update sub-budget values
  updateSubBudget(group: string, subBudget: string, month: string, value: string): void {
    const numericValue = parseFloat(value);
  
    const updatedBudgets = { ...this.budgets };
  
    if (!updatedBudgets[group]) {
      updatedBudgets[group] = {};
    }
  
    if (!updatedBudgets[group][subBudget]) {
      updatedBudgets[group][subBudget] = {};
    }
  
    updatedBudgets[group][subBudget][month] = isNaN(numericValue) ? 0 : numericValue;
  
    this.budgets = updatedBudgets;
  }
  

  addNewGroup(): void {
    const newGroupName = `New ${Object.keys(this.budgets).length + 1}`;

    if (!this.budgets[newGroupName]) {
      this.budgets[newGroupName] = {
        sub1: {},
      };
    }
  }

  addNewSub(groupName: string): void {
    const group = this.budgets[groupName];
  
    if (group) {
      const newSubName = `New Sub ${Object.keys(group).length + 1}`;
      const newSub = { [newSubName]: {} };
      this.budgets[groupName] = { ...newSub, ...group };
    }
  }

  updateGroupName(oldName: string, newName: string): void {
    if (!newName.trim() || newName === oldName) {
      return;
    }

    const groupData = this.budgets[oldName];
    delete this.budgets[oldName];
    this.budgets[newName] = groupData;
  }

  deleteGroup(groupName: string): void {
    if (this.budgets[groupName]) {
      const updatedBudgets = { ...this.budgets };
      delete updatedBudgets[groupName];
      this.budgets = updatedBudgets;
    }
  }
  

  deleteSub(groupName: string, subName: string): void {
    if (this.budgets[groupName] && this.budgets[groupName][subName]) {
      const updatedGroup = { ...this.budgets[groupName] };
      delete updatedGroup[subName];
  
      this.budgets = {
        ...this.budgets,
        [groupName]: updatedGroup,
      };
    }
  }
  

  public contextMenu = {
    visible: false,
    x: 0,
    y: 0,
    selectedMonth: '',
    selectedValue: 0,
  };

  showContextMenu(event: MouseEvent, month: string, value: number): void {
    event.preventDefault();
    this.contextMenu = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      selectedMonth: month,
      selectedValue: value,
    };
  }

  applyAll(): void {
    const { selectedMonth, selectedValue } = this.contextMenu;
  
    if (selectedMonth && selectedValue !== null) {
      const updatedBudgets = { ...this.budgets };
  
      for (const groupKey in updatedBudgets) {
        const updatedGroup = { ...updatedBudgets[groupKey] };
        for (const subKey in updatedGroup) {
          const updatedSub = { ...updatedGroup[subKey] };
          updatedSub[selectedMonth] = selectedValue;
          updatedGroup[subKey] = updatedSub;
        }
        updatedBudgets[groupKey] = updatedGroup;
      }
  
      this.budgets = updatedBudgets;
    }
  
    this.contextMenu.visible = false;
  }
  

  closeContextMenu(): void {
    this.contextMenu.visible = false;
  }
}
