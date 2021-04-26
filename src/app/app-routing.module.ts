import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ExpenseListComponent } from './expenses/expense-list/expense-list.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { OtherExpenseComponent } from './expenses/other-expense/other-expense.component';
import { SalaryExpenseComponent } from './expenses/salary-expense/salary-expense.component';
import { ServiceExpenseComponent } from './expenses/service-expense/service-expense.component';
import { IncomeListComponent } from './incomes/income-list/income-list.component';
import { IncomesComponent } from './incomes/incomes.component';
import { OfficeExpenseListComponent } from './office-expenses/office-expense-list/office-expense-list.component';
import { OfficeExpensesComponent } from './office-expenses/office-expenses.component';
import { ProfitComponent } from './profit/profit.component';
import { CalculateComponent } from './tax/calculate/calculate.component';

const routes: Routes = [
  { path: '',pathMatch: 'full', redirectTo: 'auth' },
  { path: 'auth', component: AuthComponent},
  { path: 'incomeedit/:id', component: IncomesComponent},
  { path: 'incomes', component: IncomesComponent}, 
  { path: 'incomelist',component: IncomeListComponent},
  { path: 'expenses', component: ExpensesComponent, children:[
    {path : '', pathMatch: 'full', redirectTo: 'service'},
    {path: 'service/:id', component: ServiceExpenseComponent},
    {path: 'service', component: ServiceExpenseComponent},
    {path: 'salary/:id', component: SalaryExpenseComponent},
    {path: 'salary', component: SalaryExpenseComponent},
    {path: 'other/:id', component: OtherExpenseComponent},
    {path: 'other', component: OtherExpenseComponent}
  ]},
  { path: 'expenselist', component: ExpenseListComponent },
  {path: 'tax',component: CalculateComponent},
  {path: 'officeexpense/:id',component: OfficeExpensesComponent},
  {path: 'officeexpense',component: OfficeExpensesComponent},
  {path: 'officelist',component: OfficeExpenseListComponent},
  {path: 'changepassword',component: ChangePasswordComponent},
  {path: 'profit',component: ProfitComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
