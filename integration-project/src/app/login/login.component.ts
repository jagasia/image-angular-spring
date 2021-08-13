import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:any;
  status:boolean=false;
  constructor(private fb:FormBuilder, private us: UserService, private router:Router) { 
    this.loginForm=this.fb.group({
      username:[],
      password:[]
    });
  }

  ngOnInit(): void {
  }

  fnLogin()
  {
   var username=this.loginForm.controls['username'].value;
   var password=this.loginForm.controls['password'].value;
   this.us.validateLogin(username,password).subscribe((data)=>{     
     if(data!=null)
     {  
       localStorage.setItem('user',JSON.stringify(data));
        this.router.navigate(['/','home']);
       
     }else{
       this.status=true;
     }
   });
  }

}
