import { FirestoreDbService } from 'src/app/services/firestore-db.service';
import { Especialista } from 'src/app/classes/especialista';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { DiponibilidadHorariaEspecialidad } from 'src/app/classes/diponibilidad-horaria-especialidad';

@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.css']
})
export class MisHorariosComponent implements OnInit {

  @Input() inputEspecialista : Especialista | any;
  filter : string = '';
  especialidadSeleccionada : string = '';
  tiempoEspecialidad : string = '';

  formHorarios : FormGroup | any;
  diasSemana = ['domingo', 'lunes','martes','miércoles','jueves','viernes','sábado'];

  listaEspecialidades : any[] = [];
  listaDiasEspecialidad : any[] = [];
  listadoHorariosEspecialidad : DiponibilidadHorariaEspecialidad | any = null;

  constructor(private fb : FormBuilder, private db : FirestoreDbService) {
    this.formHorarios = fb.group({
      'especialidad' : ['', Validators.required],
      'dia' : ['', Validators.required],
      'desde' : ['', [Validators.required, Validators.pattern]],
      'hasta' : ['', [Validators.required, Validators.pattern]],
      'tiempo': ['', [Validators.required, Validators.min(15)] ],
    })
   }

  ngOnInit(): void {
    this.listaEspecialidades = Object.values(this.inputEspecialista.especialidad);
  }

  seleccionarEspecialidad(especialidad : any){
    //Reset de variables
    this.especialidadSeleccionada = '';
    this.tiempoEspecialidad = '';
    this.listaDiasEspecialidad = [];
    this.listadoHorariosEspecialidad = null;
    this.formHorarios.reset();

    //Asignaciones
    this.especialidadSeleccionada = especialidad.nombre;

    this.db.getDisponibilidadesByEspecialistaEspecialidad(this.inputEspecialista.dni,this.especialidadSeleccionada)
    .subscribe((ref:any)=>{
      if(ref.length != '0'){
        let horarios = ref[0].payload.doc.data();
        horarios['id'] = ref[0].payload.doc.id;
        this.listadoHorariosEspecialidad = horarios;
        this.tiempoEspecialidad = this.listadoHorariosEspecialidad.duracion;
      }
    });
  }

  agregarDiaHorarioEspecialidad(){

    let especialidadForm = this.formHorarios.controls['especialidad'].value;
    let diaForm = this.formHorarios.controls['dia'].value;
    let desdeForm = this.formHorarios.controls['desde'].value;
    let hastaForm = this.formHorarios.controls['hasta'].value;
    let horarioEspecialidad : {} = {especialidad : especialidadForm, dia : diaForm, desde : desdeForm, hasta : hastaForm};

    this.listaDiasEspecialidad.push(horarioEspecialidad);

  }

  eliminarhorario(franja : any){
    let indiceEliminar = this.listaDiasEspecialidad.findIndex(item => {
      console.log(item)
      return item == franja;
    });

    if(indiceEliminar != -1){
      this.listaDiasEspecialidad.splice(indiceEliminar,1);
    }
  }

  altaHorarios(){
    //Se dan de baja los horarios vigentes
    if(this.listadoHorariosEspecialidad != null){
      this.db.baja(this.listadoHorariosEspecialidad.id, 'horarios_especialidad');
    }

    //Seteo de variables
    let especialidad = this.formHorarios.controls['especialidad'].value;
    let duracionTurno = this.formHorarios.controls['tiempo'].value;
    let horariosEspecialidad : DiponibilidadHorariaEspecialidad = new DiponibilidadHorariaEspecialidad(this.listaDiasEspecialidad, this.inputEspecialista, especialidad, duracionTurno);

    //Alta propiamente dicha
    this.db.alta(JSON.parse(JSON.stringify(horariosEspecialidad)),'horarios_especialidad')
    .then(this.formHorarios.reset())
    .catch(error => console.log(error));

  }

}
