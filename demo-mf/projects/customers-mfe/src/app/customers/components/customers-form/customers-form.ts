import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../../../core/mock-api-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'customers-form',
  templateUrl: './customers-form.html',
  // styleUrls: ['./customer-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,    // Essential for formGroup, formControlName
    MatFormFieldModule,     // For mat-form-field, mat-label, mat-error
    MatInputModule,         // For matInput directive
    MatButtonModule         // If you have submit buttons
    // ...other imports
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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });

    const customerValue = this.customer();
    if (customerValue) {
      this.form.patchValue(customerValue);
    }
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
