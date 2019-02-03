import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss']
})
export class CheckBoxComponent implements OnInit {

  @Input() text: String;
  @Input() enabled = false;

  constructor() { }

  ngOnInit() {
  }

}
