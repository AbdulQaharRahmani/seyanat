import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IncomesComponent } from './incomes/incomes.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IncomeListComponent } from './incomes/income-list/income-list.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { SalaryExpenseComponent } from './expenses/salary-expense/salary-expense.component';
import { ServiceExpenseComponent } from './expenses/service-expense/service-expense.component';
import { OtherExpenseComponent } from './expenses/other-expense/other-expense.component';
import { ExpenseListComponent } from './expenses/expense-list/expense-list.component';
import { CalculateComponent } from './tax/calculate/calculate.component';
import { AuthComponent } from './auth/auth.component';
import {MatMenuModule} from '@angular/material/menu';
import { NgxPrintModule } from 'ngx-print';
import { PrintItemComponent } from './print-item/print-item.component';
import { OfficeExpensesComponent } from './office-expenses/office-expenses.component';
import { OfficeExpenseListComponent } from './office-expenses/office-expense-list/office-expense-list.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ProfitComponent } from './profit/profit.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    IncomesComponent,    
    IncomeListComponent,
    ExpensesComponent,
    ServiceExpenseComponent,
    SalaryExpenseComponent,
    OtherExpenseComponent,
    ExpenseListComponent,
    CalculateComponent,
    AuthComponent,
    PrintItemComponent,
    OfficeExpensesComponent,
    OfficeExpenseListComponent,
    ChangePasswordComponent,
    ProfitComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatMenuModule,
    NgxPrintModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
