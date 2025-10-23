import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../../../core/mock-api-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormUtils } from '../../utils/form-utils';


@Component({
  selector: 'customers-form',
  templateUrl: './customers-form.html',
  // styleUrls: ['./customer-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class CustomersFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  customer = input<Customer | null>();
  save = output<Partial<Customer>>();
  cancel = output<void>();

  form!: FormGroup;

  constructor() {
    effect(() => {
      const customerValue = this.customer();

      if (this.form) {
        this.form.reset();

        if (customerValue) {
          this.form.patchValue(customerValue);
        }
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      name: ['', [Validators.required, FormUtils.nameValidator]],
      email: ['', [Validators.required, FormUtils.mailValidator]],
      phone: ['', [Validators.required, FormUtils.phoneValidator]],
    });

    const customerValue = this.customer();
    if (customerValue) {
      this.form.patchValue(customerValue);
    }
  }

  // Método para obtener errores usando FormUtils
  getFieldError(fieldName: string): string | null {
    return FormUtils.getFieldError(this.form, fieldName);
  }

  // Método para verificar si un campo es válido
  isValidField(fieldName: string): boolean | null {
    return FormUtils.isValidField(this.form, fieldName);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
