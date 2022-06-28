export class DiponibilidadHorariaEspecialidad {
  public diaHorario: any[];
  public especialista: string;
  public especialidad: string;
  public duracion: number;


  constructor(dH: any[], especialista: string, especialidad: string, duracionTurno: number) {
      this.diaHorario = dH;
      this.especialista = especialista;
      this.especialidad = especialidad;
      this.duracion = duracionTurno;

  }
}
