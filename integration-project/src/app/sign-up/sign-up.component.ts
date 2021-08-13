import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, DoCheck {
  signupForm:any;
  status:string='';
  file:File|any=null;
  users:any;
  constructor(private fb:FormBuilder, private us:UserService) {
    this.signupForm=this.fb.group({
      username:[],
      firstName:[],
      lastName:[],
      password:[],
      cpassword:[],
      dateOfBirth:[],
      email:[],
      pic:[]
    });
   }
  ngDoCheck(): void {
    // console.log('This is ng do check');
    // this.status=this.status+'';
  }

  ngOnInit(): void {
    //executes only once in this component life cycle
    //if browser is refreshed then this method is executed
    this.getAllUsers();
  }

  fnFileChanged(event:any)
  {
    this.file=event.target.files[0];
    console.log("file change event");
    console.log(this.file);
    
  }

  fnSignUp()
  {
    console.log("Sending: ");
    console.log(this.signupForm.value);

    var formdata=new FormData();
    
    formdata.append('username',this.signupForm.controls['username'].value);
    formdata.append('password',this.signupForm.controls['password'].value);
    formdata.append('firstName',this.signupForm.controls['firstName'].value);
    formdata.append('lastName',this.signupForm.controls['lastName'].value);
    formdata.append('dateOfBirth',this.signupForm.controls['dateOfBirth'].value);
    formdata.append('email',this.signupForm.controls['email'].value);
    formdata.append('pic',this.file,this.file.name);


    // //i need to call service method....   first inject the service in constructor
    this.us.signup(formdata).subscribe((data)=>{
      console.log("Response from REST api is as below:");
      console.log(data);
      this.getAllUsers();
    },(error)=>{
      this.status='Server did not respond';      
    });

  }

  getAllUsers()
  {
    this.us.getAllusers().subscribe((data)=>{
      this.users=data;
    });
  }
}
