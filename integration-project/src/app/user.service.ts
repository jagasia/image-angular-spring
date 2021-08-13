import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url:string='http://localhost:8080/user';
  constructor(private http:HttpClient) { }

  checkLoginStatus()
  {
    // const myObservable=new Observable(observer=>{
    //   setTimeout(()=>{
    //     var status='login';
    //     var loggedUserName=localStorage.getItem("user");
    //     // alert(loggedUserName)
    //     if(loggedUserName!=null)
    //     {
    //       status='logout';
    //       // alert('changing to Logout');
    //     } 
    //     observer.next(status);
    //   },100);
    // });
    // return myObservable;

        var status='login';
        var loggedUserName=localStorage.getItem("user");
        // alert(loggedUserName)
        console.log('user service, checking status... user object is :');
        console.log(loggedUserName);
        
        
        if(loggedUserName!=null)
        {
          status='logout';
        }
        return status;
  }
  

  generateOtp(email:string)
  {
    return this.http.get(this.url+"/otp/"+email);
  }

  signup(user:any):Observable<object>
  {
    return this.http.post(this.url+"/pic",user);
  }
  validateLogin(username:string, password:string)
  {
    return this.http.post(this.url+"/"+username+"/"+password,null);
  }
  findUserByUsername(username:string)
  {
    return this.http.get(this.url+"/"+username);
  }
  getAllusers(){
    return this.http.get(this.url);
  }
  modifyUser(user:any)
  {
    return this.http.put(this.url,user);
  }
  removeUser(username:string)
  {
    return this.http.delete(this.url+"/"+username);
  }
}
