import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-general',
  templateUrl: './loading-general.component.html',
  styleUrls: ['./loading-general.component.css']
})
export class LoadingGeneralComponent implements OnInit {

  @Input() inputLoading : boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
