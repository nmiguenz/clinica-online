export class Log {
  public usuario: any;
  public perfil: string;
  public fechaDeIngreso: Date;

  constructor(usuario: any, tipo: string, fechaDeIngreso: Date) {
    this.usuario = usuario;
    this.perfil = tipo;
    this.fechaDeIngreso = fechaDeIngreso;
  }
}
