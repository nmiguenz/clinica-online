export class Paciente {
  nombre : string = '';
  apellido : string = '';
  edad : number = 0;
  dni : number = 0;
  mail : string = '';
  password : string = '';
  obraSocial : string = '';
  fotoUno : string = '';
  fotoDos : string = '';
  perfil : string = '';

  constructor(name:string, surname:string, age:number, id:number, ob:string, email:string, pass:string, img:string, img2:string, perfil:string){
    this.nombre = name;
    this.apellido = surname;
    this.edad = age;
    this.dni = id;
    this.obraSocial = ob;
    this.mail = email;
    this.password = pass;
    this.fotoUno = img;
    this.fotoDos = img2;
    this.perfil = perfil;
  }
}
