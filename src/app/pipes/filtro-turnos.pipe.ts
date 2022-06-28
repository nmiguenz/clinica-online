import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroTurnos'
})
export class FiltroTurnosPipe implements PipeTransform {

  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item =>
      (item.especialidad.toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
      (item.datosEspecialista.nombre.toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
      (item.datosEspecialista.apellido.toLowerCase().indexOf(filter.toLowerCase()) !== -1));
  }
}
