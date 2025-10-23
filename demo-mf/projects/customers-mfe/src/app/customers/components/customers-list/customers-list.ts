import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Customer } from '../../../core/mock-api-interceptor';
import { MatIcon } from "@angular/material/icon";
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'customers-list',
  templateUrl: './customers-list.html',
  styleUrls: ['./customers-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,    // This provides matRowDef, matHeaderRowDef, matCellDef, etc.
    MatIcon,     // For mat-icon
    MatButtonModule    // For mat-icon-button
  ]
})
export class CustomersListComponent {
  customers = input<Customer[]>([]);
  edit = output<Customer>();
  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];

  onEdit(customer: Customer): void {
    this.edit.emit(customer);
  }
}
