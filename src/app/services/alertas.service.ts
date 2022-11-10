import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  constructor() {}

  confirmacionAlert(titulo: string, mensaje: string) {
    Swal.fire(titulo, mensaje, 'success');
  }

  errorAlert(titulo: string, mensaje: string) {
    Swal.fire(titulo, mensaje, 'error');
  }
}
