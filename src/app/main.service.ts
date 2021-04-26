import { Injectable } from '@angular/core';
import { Employee } from './models/employee.model';
import { ShareHolder } from './models/shareholder.model';

@Injectable({providedIn: 'root'})
export class MainService{
    shareholders = [new ShareHolder(1,'حکیم سهیل'),
                  new ShareHolder(2,'امان الله احمدزی'),
                  new ShareHolder(3,'احمد بکتاش بریالی')
    ];
    income_types = ['قضیه','مشاوره','ترجمه','متفرقه'];
    tax_types = ['ماهانه','ربع وار','سالانه']
    employees = [new Employee(1,'شمس الله','عاصی'), new Employee(2,'شهیر','حنیف')];
    expense_types = ['پول اتاق','برق','انترنت','تلیفون','کرایه','اجوره چوکی دار','مالیات ماهانه','مالیات ربع وار','مالیات سالانه','متفرقه'];
    expense_for_search = ['معاشات','مصارف خدماتی',...this.expense_types];
    office_expense_types = ['ترانسپورتیشن','مصارف اداری','اعلانات و تبلیغات','متفرقه'];
    columnNames = {
        employee_id: 'کارمند',
        service_type: 'نوع قضیه',
        service_id: 'نمبر مسلسل',
        expense_type: 'نوع مصرف',
        expense_description: 'ملاحظات',
        given_date: 'تاریخ پرداخت',
        given_by: 'پول دهنده',
        amount: 'مقدار',
        created_at: 'تاریخ ورود',
        id: 'آیدی',
        months: 'ماه',
        monthly_tax: 'مقدار',
        quarters: 'ربع',
        type: 'نوع',
        total: 'مقدار',
        received_by: 'دریافت کننده',
        received_at: 'تاریخ دریافت'
    }
    getColumnNames(){
        return this.columnNames;
    }
    getShareHolders(){
        return this.shareholders.slice();
    }
    getTaxTypes(){
        return this.tax_types.slice();
    }
    getIncomeTypes(){
        return this.income_types.slice();
    }
    getEmployees(){
        return this.employees.slice();
    }
    getExpenseType(){
        return this.expense_types.slice();
    }
    getExpenseListForSearch(){
        return this.expense_for_search.slice();
    }
    getOfficeExpenseTypes(){
        return this.office_expense_types.slice();
    }
}