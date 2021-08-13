import { Component, DoCheck, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, DoCheck {
  status:string='login';
  constructor(private us:UserService) { }
  ngDoCheck(): void {
    console.log('do check')
    this.status=this.us.checkLoginStatus();
    console.log(this.status);
  }

  ngOnInit(): void {
    
  }

}
