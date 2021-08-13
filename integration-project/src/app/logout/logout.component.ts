import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private us:UserService) { }

  ngOnInit(): void {
    localStorage.removeItem('user');
    this.us.checkLoginStatus();
  }

}
