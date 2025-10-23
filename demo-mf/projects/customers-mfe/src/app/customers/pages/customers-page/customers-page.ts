import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CustomersListComponent } from '../../components/customers-list/customers-list';
import { CustomersFormComponent } from '../../components/customers-form/customers-form';
import { CustomerService } from '../../services/customers.service';
import { Customer } from '../../../core/mock-api-interceptor';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    CustomersListComponent,
    CustomersFormComponent,
  ],
  templateUrl: './customers-page.html',
  styleUrls: ['./customers-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPageComponent {
  private customerService = inject(CustomerService);

  public showForm = signal(false);
  public selectedCustomer = signal<Customer | null>(null);

  public customers = this.customerService.customers;
  public loading = this.customerService.loading;

  onEdit(customer: Customer): void {
    this.selectedCustomer.set(customer);
    this.showForm.set(true);
  }

  onNew(): void {
    this.selectedCustomer.set(null);
    this.showForm.set(true);
  }

  onSave(customer: Partial<Customer>): void {
    const saveOperation = customer.id
      ? this.customerService.updateCustomer(customer.id, customer)
      : this.customerService.addCustomer(customer as Omit<Customer, 'id'>);

    saveOperation.subscribe(() => {
      this.onCancel();
    });
  }

  onCancel(): void {
    this.showForm.set(false);
    this.selectedCustomer.set(null);
  }
}
