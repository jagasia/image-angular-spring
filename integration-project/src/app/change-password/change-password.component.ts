import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ɵangular_packages_router_router_b } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  showTimer:boolean=false;
  changeForm:any;
  constructor(private fb:FormBuilder, private us:UserService) { 
    this.changeForm=this.fb.group({
      username:[],
      otp:[],
      password:[],
      cpassword:[]
    });
  }

  ngOnInit(): void {
  }

  fnGenerateOtp()
  {
    var username=this.changeForm.controls['username'].value;
    if(username=='')
    {
      alert('Please enter your username to generate otp')
      return;
    }
    this.us.generateOtp(username).subscribe((data)=>{
      console.log(data);
      localStorage.setItem('otp',data.toString());
    },(error)=>{
      console.log(error);
    });
  }

  fnChangePassword()
  {
    this.showTimer=true;
    //check otp entered
    //find user object from rest api using username
    var username=this.changeForm.controls['username'].value;
    console.log(username);
    var user:any=null;
    this.us.findUserByUsername(username).subscribe((data)=>{
      console.log(data);
      user=data;
      console.log(user);

      
    var otp=localStorage.getItem('otp');
    console.log('from localstorage:'+otp);
    var userEnteredOtp:string=this.changeForm.controls['otp'].value;
    console.log('user entered otp:'+userEnteredOtp);
    if(otp!=userEnteredOtp)
    {
      alert('Otp is incorrect');
      return;
    }
    user.password=this.changeForm.controls['password'].value;
    this.us.modifyUser(user).subscribe((data)=>{
      console.log(data);
      
      alert('Password is updated successfully');
      this.showTimer=false;
    });

    },(error)=>{
      alert('No user found for the given username');
      return;
    });
    //and update the password proposed by user now (bcos otp is correct). update the user object send it to rest api
    
    

  }
}
