import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarEspePacienteAdmin'
})
export class FiltrarEspePacienteAdminPipe implements PipeTransform {

  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item =>
      (item.nombre.toLowerCase().indexOf(filter.toLowerCase()) !==  -1) ||
      (item.apellido.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
    );
  }

}
