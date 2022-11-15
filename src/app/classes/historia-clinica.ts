export class HistoriaClinica {
  public fecha: Date;
  public paciente: string;
  public especialista: string;
  public especialidad: string;
  public altura: number;
  public peso: number;
  public temperatura: number;
  public presion: number;
  public clave1: string;
  public valor1: any;
  public clave2: string;
  public valor2: any;
  public clave3: string;
  public valor3: any;

  constructor(
    fecha: Date,
    paciente: string,
    especialista: string,
    especialidad: string,
    altura: number,
    peso: number,
    temperatura: number,
    presion: number,
    clave1: string,
    valor1: any,
    clave2: string,
    valor2: any,
    clave3: string,
    valor3: any
  ) {
    this.fecha = fecha;
    this.paciente = paciente;
    this.especialista = especialista;
    this.especialidad = especialidad;
    this.altura = altura;
    this.peso = peso;
    this.temperatura = temperatura;
    this.presion = presion;
    this.clave1 = clave1;
    this.valor1 = valor1;
    this.clave2 = clave2;
    this.valor2 = valor2;
    this.clave3 = clave3;
    this.valor3 = valor3;
  }
}
