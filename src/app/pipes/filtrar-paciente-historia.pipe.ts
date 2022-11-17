import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarPacienteHistoria',
})
export class FiltrarPacienteHistoriaPipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(
      (item) =>
        item.paciente.nombre.toLowerCase().indexOf(filter.toLowerCase()) !==
          -1 ||
        item.paciente.apellido.toLowerCase().indexOf(filter.toLowerCase()) !==
          -1
    );
  }
}
