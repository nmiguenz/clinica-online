import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroMisturnosEspecialista'
})
export class FiltroMisturnosEspecialistaPipe implements PipeTransform {

  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item =>
      (item.datosPaciente.nombre.toLowerCase().indexOf(filter.toLowerCase()) !==  -1) ||
      (item.datosPaciente.apellido.toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
      (item.especialidad.indexOf(filter.toLowerCase()) !== -1)
    );
  }

}
