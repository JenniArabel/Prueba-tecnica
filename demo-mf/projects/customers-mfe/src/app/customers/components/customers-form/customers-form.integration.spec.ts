import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomersFormComponent } from './customers-form';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CustomersFormComponent (integración)', () => {
  let component: CustomersFormComponent;
  let fixture: ComponentFixture<CustomersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersFormComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
    fixture = TestBed.createComponent(CustomersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe renderizar los campos del formulario', () => {
    const nameInput = fixture.debugElement.query(By.css('input[formControlName="name"]'));
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    const phoneInput = fixture.debugElement.query(By.css('input[formControlName="phone"]'));
    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(phoneInput).toBeTruthy();
  });

  it('debe emitir el evento save con los datos correctos al hacer submit', () => {
    spyOn(component.save, 'emit');
    component.form.setValue({
      id: null,
      name: 'Juan Perez',
      email: 'juan@mail.com',
      phone: '1234567890',
    });
    fixture.detectChanges();
    component.onSubmit();
    expect(component.save.emit).toHaveBeenCalledWith({
      id: undefined,
      name: 'Juan Perez',
      email: 'juan@mail.com',
      phone: '1234567890',
    });
  });
});
