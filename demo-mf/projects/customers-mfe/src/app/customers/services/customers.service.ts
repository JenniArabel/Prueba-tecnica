import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Customer } from '../../core/mock-api-interceptor';

/**
 * Interfaz que define la estructura del estado que gestionará el servicio.
 * Incluye la lista de clientes y el estado de carga (loading).
 */
interface CustomersState {
  customers: Customer[];
  loading: boolean;
}

/**
 * Servicio encargado de la gestión de clientes.
 *
 * Este servicio aplica el principio de Responsabilidad Única (SOLID), ya que su única
 * responsabilidad es gestionar los datos y el estado de los clientes.
 *
 * Utiliza Angular Signals para una gestión de estado moderna y reactiva.
 * El estado es privado (#state) y solo se puede modificar a través de los métodos del servicio,
 * siguiendo el patrón de "Single Source of Truth" (Única Fuente de la Verdad).
 */
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = '/api/customers';

  // --- Gestión de Estado con Signals ---

  // #state es un signal privado que contiene el estado completo del servicio.
  #state = signal<CustomersState>({
    customers: [],
    loading: false,
  });

  // --- Selectores Públicos (Computed Signals) ---

  // Exponemos los datos del estado de forma reactiva y de solo lectura.
  // Los componentes que usen estos signals se actualizarán automáticamente
  // cuando el estado (#state) cambie.
  public customers = computed(() => this.#state().customers);
  public loading = computed(() => this.#state().loading);

  constructor() {
    // Cargamos los clientes iniciales cuando el servicio se instancia por primera vez.
    this.loadCustomers();
  }

  /**
   * Obtiene la lista de clientes de la API y actualiza el estado.
   */
  private loadCustomers(): void {
    this.#state.update((state) => ({ ...state, loading: true }));

    this.http
      .get<Customer[]>(this.apiUrl)
      .pipe(
        tap((customers) => {
          this.#state.update((state) => ({
            ...state,
            customers,
            loading: false,
          }));
        })
      )
      .subscribe();
  }

  /**
   * Obtiene un único cliente por su ID desde la API.
   * @param id El ID del cliente a buscar.
   * @returns Un Observable con el cliente encontrado.
   */
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  /**
   * Añade un nuevo cliente a través de la API y actualiza el estado.
   * @param customerData Los datos del cliente a crear (sin ID).
   * @returns Un Observable con el cliente recién creado.
   */
  addCustomer(customerData: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customerData).pipe(
      tap((newCustomer) => {
        console.log('addCustomer tap', newCustomer);
        // En vez de modificar el array local, recargamos la lista desde la API para evitar duplicados.
        this.loadCustomers();
      })
    );
  }

  /**
   * Actualiza un cliente existente a través de la API y actualiza el estado.
   * @param id El ID del cliente a actualizar.
   * @param customerData Los datos a modificar.
   * @returns Un Observable con el cliente actualizado.
   */
  updateCustomer(id: number, customerData: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customerData).pipe(
      tap((updatedCustomer) => {
        // Actualizamos el estado local con el cliente modificado.
        this.#state.update((state) => ({
          ...state,
          customers: state.customers.map((c) => (c.id === id ? updatedCustomer : c)),
        }));
      })
    );
  }
}
