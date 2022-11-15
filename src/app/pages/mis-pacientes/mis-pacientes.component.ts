import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { Especialista } from './../../classes/especialista';
import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/classes/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { Turno } from 'src/app/classes/turno';
import { HistoriaClinica } from 'src/app/classes/historia-clinica';

@Component({
  selector: 'app-mis-pacientes',
  templateUrl: './mis-pacientes.component.html',
  styleUrls: ['./mis-pacientes.component.css'],
})
export class MisPacientesComponent implements OnInit {
  //Listados
  listaPacientes: Paciente[] = [];
  listaPacientesDni: number[] = [];
  listaHistoriaPaciente: any[] = [];
  listaHistorias: any[] = [];
  listaUsuarios: any[] = [];
  dniUnicos: number[] | any;

  //
  idHistoria: string = '';
  historia: HistoriaClinica | any;
  paciente: Paciente | any;
  pacienteSeleccionado: Paciente | any;
  especialistaLogueado: Especialista | any;
  historiaSeleccionada: any = null;
  pantallaSeleccionada: string = '';

  filter: string = '';
  mostrar: boolean = false;

  constructor(private auth: AuthService, private db: FirestoreDbService) {
    this.especialistaLogueado = this.auth.usuarioLogueado;
    this.obtenerUsuarios();
  }

  ngOnInit(): void {
    //Obtiene todos los DNI de los pacientes atendidos por un paciente en particular
    this.db
      .getTurnosFinalizadosByEspecialista(this.especialistaLogueado.dni)
      .subscribe((turnos: any) => {
        this.listaPacientesDni = turnos.map((turno: any) => {
          return turno.payload.doc.data().datosPaciente.dni;
        });

        //Filtra los dni unicos
        this.dniUnicos = this.filtrarUnicos(this.listaPacientesDni);

        //Armado del objeto para mostrar historias
        this.dniUnicos.forEach((dni: number) => {
          this.listaUsuarios.forEach((paciente: Paciente) => {
            if (paciente.dni == dni) {
              this.db
                .getHistoriasByEspecialistaPacienteOrderLimit(
                  this.especialistaLogueado.dni,
                  dni.toString(),
                  'fecha',
                  'desc',
                  3
                )
                .subscribe((historias: any) => {
                  historias.forEach((element: any) => {
                    this.idHistoria = element.payload.doc.id;
                    this.historia = element.payload.doc.data();
                    this.historia = {
                      id: this.idHistoria,
                      historia: this.historia,
                    };

                    this.listaHistorias.push(this.historia);
                    console.log('Listado: ', this.listaHistorias);
                  });

                  this.listaHistoriaPaciente.push({
                    paciente: paciente,
                    historias: this.listaHistorias,
                  });

                  this.listaHistorias = [];
                });
            }
          });
        });

        console.log('Historias por paciente: ', this.listaHistoriaPaciente);
      });
  }

  seleccionarPaciente(paciente: Paciente) {
    this.pacienteSeleccionado = paciente;
    // this.mostrarHistoria = true;
  }

  async obtenerUsuarios() {
    await this.db
      .getCollection('usuarios')
      .then((res: any) =>
        res.subscribe((element: any) => {
          element.forEach((usuarioRef: any) => {
            this.listaUsuarios.push(usuarioRef.payload.doc.data());
          });
        })
      )
      .catch((error) => console.log(error));
  }

  filtrarUnicos(array: any) {
    const dataArr = new Set(array);
    return [...dataArr]; //Obtengo los dnis unicos
  }

  mostrarHistoria(historia: HistoriaClinica) {
    if (this.historiaSeleccionada != null) {
      this.historiaSeleccionada = null;
      this.pantallaSeleccionada = '';
      this.mostrar = false;
    }
    this.historiaSeleccionada = historia;
    this.pantallaSeleccionada = 'misPacientes';
    this.mostrar = true;
    console.log(this.historiaSeleccionada, this.pantallaSeleccionada);
  }
}
