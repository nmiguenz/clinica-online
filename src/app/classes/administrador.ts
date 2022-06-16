export class Administrador {
  nombre : string = '';
  apellido : string = '';
  edad : number = 0;
  dni : number = 0;
  mail : string = '';
  password : string = '';
  fotoUno : string = '';
  perfil : string = '';
  habilitado: boolean;

  constructor(name:string, surname:string, age:number, id:number, email:string, pass:string, img:string, perfil: string,habilitado: boolean){
    this.nombre = name;
    this.apellido = surname;
    this.edad = age;
    this.dni = id;
    this.mail = email;
    this.password = pass;
    this.fotoUno = img;
    this.perfil = perfil;
    this.habilitado = habilitado;
  }
}
