import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { Especialista } from './../../classes/especialista';
import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/classes/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { Turno } from 'src/app/classes/turno';

@Component({
  selector: 'app-mis-pacientes',
  templateUrl: './mis-pacientes.component.html',
  styleUrls: ['./mis-pacientes.component.css']
})
export class MisPacientesComponent implements OnInit {

  listaPacientes: Paciente[] = [];
  pacienteSeleccionado : Paciente | any;
  especialistaLogueado : Especialista | any;
  listaPacientesDni : number[] = [] ;
  filter: string = '';
  mostrarHistoria : boolean = false;

  constructor(private auth : AuthService, private db : FirestoreDbService) { }

  ngOnInit(): void {
    this.especialistaLogueado = this.auth.usuarioLogueado;

    this.db.getTurnosFinalizadosByEspecialista(this.especialistaLogueado.dni).subscribe((turnos: any) => {
      this.listaPacientesDni = turnos.map((turno : any)=>{
        return turno.payload.doc.data().datosPaciente.dni;
      });
      this.db.getByList('dni',this.listaPacientesDni).subscribe((pacientes:any)=>{
        this.listaPacientes = pacientes.map((paciente : any)=>{
          return paciente.payload.doc.data();
        });
      });
    });

  }

  seleccionarPaciente(paciente: Paciente) {
    this.pacienteSeleccionado = paciente;
    this.mostrarHistoria = true;
  }
}
