import { Component, OnInit } from '@angular/core';
import {BaseSegmentPage} from "../base-segment.page";

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.page.html',
  styleUrls: ['./profile-client.page.scss'],
})
export class ProfileClientPage extends BaseSegmentPage implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
