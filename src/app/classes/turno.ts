import { Paciente } from './paciente';
import { Especialista } from './especialista';

export class Turno {
  public datosEspecialista: Especialista;
  public especialidad: string;
  public datosPaciente: Paciente;
  public fecha: Date;
  public estado: EstadoTurno;
  public encuesta: string;
  public calificacion: string;
  public resenia: string;
  public comentario: string;
  public idHistoriaClinica: string;

  constructor(
    datosEspecialista: Especialista,
    datosEspecialidad: string,
    datosPaciente: Paciente,
    fecha: Date,
    estado: EstadoTurno,
    encuesta: string,
    calificacion: string,
    resenia: string,
    coment: string,
    id: string
  ) {
    this.datosEspecialista = datosEspecialista;
    this.especialidad = datosEspecialidad;
    this.datosPaciente = datosPaciente;
    this.fecha = fecha;
    this.estado = estado;
    this.encuesta = encuesta;
    this.calificacion = calificacion;
    this.resenia = resenia;
    this.comentario = coment;
    this.idHistoriaClinica = id;
  }
}

export enum EstadoTurno {
  aceptado = 'aceptado',
  cancelado = 'cancelado',
  rechazado = 'rechazado',
  pendiente = 'pendiente',
  finalizado = 'finalizado',
}
