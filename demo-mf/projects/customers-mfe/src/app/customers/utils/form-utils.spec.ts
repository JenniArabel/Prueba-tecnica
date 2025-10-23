import { FormControl, FormGroup } from '@angular/forms';
import { FormUtils } from './form-utils';

describe('FormUtils', () => {
  describe('nameValidator', () => {
    it('debe aceptar un nombre y apellido válidos', () => {
      const control = new FormControl('Juan Perez');
      expect(FormUtils.nameValidator(control)).toBeNull();
    });

    it('debe rechazar un nombre muy corto', () => {
      const control = new FormControl('Ana');
      const result = FormUtils.nameValidator(control);
      expect(result).toEqual({ nameMinLength: { requiredLength: 5, actualLength: 3 } });
    });

    it('debe rechazar un nombre muy largo', () => {
      const control = new FormControl('Nombre ApellidoLargoMasDe15');
      const result = FormUtils.nameValidator(control);
      expect(result).toEqual({ nameMaxLength: { requiredLength: 15, actualLength: 27 } });
    });

    it('debe rechazar si no tiene espacio entre nombre y apellido', () => {
      const control = new FormControl('JuanPerez');
      const result = FormUtils.nameValidator(control);
      expect(result).toEqual({ invalidNameFormat: true });
    });
  });

  describe('mailValidator', () => {
    it('debe aceptar un email válido', () => {
      const control = new FormControl('correo@dominio.com');
      expect(FormUtils.mailValidator(control)).toBeNull();
    });

    it('debe rechazar un email inválido', () => {
      const control = new FormControl('correo@dominio');
      const result = FormUtils.mailValidator(control);
      expect(result).toEqual({ invalidEmailFormat: true });
    });
  });

  describe('phoneValidator', () => {
    it('debe aceptar un teléfono válido', () => {
      const control = new FormControl('1234567890');
      expect(FormUtils.phoneValidator(control)).toBeNull();
    });

    it('debe rechazar un teléfono muy corto', () => {
      const control = new FormControl('12345');
      const result = FormUtils.phoneValidator(control);
      expect(result).toEqual({ phoneMinLength: { requiredLength: 10, actualLength: 5 } });
    });

    it('debe rechazar un teléfono con formato inválido', () => {
      const control = new FormControl('abc1234567');
      const result = FormUtils.phoneValidator(control);
      expect(result).toEqual({ invalidPhoneFormat: true });
    });
  });
});
