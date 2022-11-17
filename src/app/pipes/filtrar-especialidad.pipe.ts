import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarEspecialidad',
})
export class FiltrarEspecialidadPipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(
      (item) => item.nombre.toLowerCase().indexOf(filter.toLowerCase()) !== -1
    );
  }
}
