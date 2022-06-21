import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-admin',
  templateUrl: './loading-admin.component.html',
  styleUrls: ['./loading-admin.component.css']
})
export class LoadingAdminComponent implements OnInit {

  @Input() inputLoading : boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
