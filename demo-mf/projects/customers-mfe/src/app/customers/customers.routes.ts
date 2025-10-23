import { Routes } from '@angular/router';
import { CustomersPageComponent } from './pages/customers-page/customers-page';
import { CustomersFormComponent } from './components/customers-form/customers-form';

export const customersRoutes: Routes = [
  {
    path: '',
    component: CustomersPageComponent,
  },
  {
    path: 'new',
    component: CustomersFormComponent,
  },
  {
    path: 'edit/:id',
    component: CustomersFormComponent,
  },
];
