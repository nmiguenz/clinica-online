import { Paciente } from './paciente';
import { Especialista } from './especialista';

export class Turno {
  public datosEspecialista : Especialista
  public especialidad: string;
  public datosPaciente: Paciente;
  public fecha: Date;
  public estado: EstadoTurno;
  public encuesta: string;
  public calificacion: string;
  public resenia: string;


  constructor(datosEspecialista: Especialista, datosEspecialidad: string, datosPaciente: Paciente, fecha: Date, estado: EstadoTurno, encuesta: string, calificacion: string, resenia: string) {
      this.datosEspecialista = datosEspecialista;
      this.especialidad = datosEspecialidad;
      this.datosPaciente = datosPaciente;
      this.fecha = fecha;
      this.estado = estado;
      this.encuesta = encuesta;
      this.calificacion = calificacion;
      this.resenia = resenia;
  }
}

export enum EstadoTurno {
  aceptado = "Aceptado",
  cancelado = "Cancelado",
  rechazado = "Rechazado",
  pendiente = "Pendiente",
  finalizado = "Finalizado"
}

