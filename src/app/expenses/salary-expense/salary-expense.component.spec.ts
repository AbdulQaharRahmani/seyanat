import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryExpenseComponent } from './salary-expense.component';

describe('SalaryExpenseComponent', () => {
  let component: SalaryExpenseComponent;
  let fixture: ComponentFixture<SalaryExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryExpenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
