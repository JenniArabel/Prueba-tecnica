import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Interfaz que define la estructura de un cliente.
 * Cumple con el principio de Inversión de Dependencias (SOLID),
 * ya que los componentes y servicios dependerán de esta abstracción, no de una implementación concreta.
 */
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// --- Base de datos simulada en memoria ---
let customers: Customer[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321' },
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', phone: '555-555-5555' },
  { id: 4, name: 'Maria Garcia', email: 'maria.garcia@example.com', phone: '111-222-3333' },
];

// Variable para simular el autoincremento de IDs en la base de datos.
let nextId = 5;

/**
 * Interceptor que simula un backend para la gestión de clientes.
 * Este enfoque es ideal para desarrollo y pruebas, ya que nos permite trabajar
 * en el frontend sin depender de un backend real.
 *
 * @param req La solicitud HTTP saliente.
 * @param next El siguiente interceptor en la cadena.
 * @returns Un Observable del evento HTTP.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method, body } = req;

  // Solo interceptamos las llamadas dirigidas a nuestra API simulada.
  // Las demás solicitudes (ej. a otros dominios, archivos locales) no se modifican.
  if (!url.includes('/api/customers')) {
    return next(req);
  }

  console.log(`[Mock API Interceptor] Intercepted ${method} ${url}`);

  // Se envuelve la lógica en un `of()` para devolver un Observable, que es lo que Angular espera.
  // El `delay(500)` simula la latencia de una red, haciendo que la UI parezca más realista.
  return of(handleRoutes()).pipe(delay(500));

  /**
   * Función anidada que contiene la lógica de enrutamiento para la API simulada.
   * Ayuda a mantener el código del interceptor principal más limpio (Principio de Responsabilidad Única).
   */
  function handleRoutes(): HttpResponse<any> {
    // --- GET: Listar todos los clientes ---
    if (url.endsWith('/api/customers') && method === 'GET') {
      return new HttpResponse({ status: 200, body: customers });
    }

    // --- GET: Obtener un cliente por su ID ---
    const singleCustomerMatch = url.match(/\/api\/customers\/(\d+)/);
    if (singleCustomerMatch && method === 'GET') {
      const id = parseInt(singleCustomerMatch[1], 10);
      const customer = customers.find(c => c.id === id);
      return customer
        ? new HttpResponse({ status: 200, body: customer })
        : new HttpResponse({ status: 404, body: { error: 'Customer not found' } });
    }

    // --- POST: Crear un nuevo cliente ---
    if (url.endsWith('/api/customers') && method === 'POST') {
      const newCustomerData = body as Omit<Customer, 'id'>;
      const newCustomer: Customer = {
        id: nextId++,
        ...newCustomerData,
      };
      customers.push(newCustomer);
      return new HttpResponse({ status: 201, body: newCustomer });
    }

    // --- PUT: Actualizar un cliente existente ---
    if (singleCustomerMatch && method === 'PUT') {
      const id = parseInt(singleCustomerMatch[1], 10);
      const updatedData = body as Partial<Customer>;
      const customerIndex = customers.findIndex(c => c.id === id);

      if (customerIndex !== -1) {
        customers[customerIndex] = { ...customers[customerIndex], ...updatedData, id };
        return new HttpResponse({ status: 200, body: customers[customerIndex] });
      } else {
        return new HttpResponse({ status: 404, body: { error: 'Customer not found' } });
      }
    }

    // Si ninguna ruta de la API coincide, devolvemos un error.
    return new HttpResponse({ status: 404, body: { error: 'API route not found' } });
  }
};
