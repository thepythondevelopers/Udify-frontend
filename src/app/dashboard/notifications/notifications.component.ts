import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notf: any=[];

  constructor(
    public api: ApiService,
  ) { 
    this.notification();
  }

  ngOnInit(): void {
  }

  delete_notf(notf_id:any){
    console.log("notf_id",notf_id);
    this.api.post('aware-node/delete-notification', {"email":JSON.parse(localStorage.getItem('user')).email,"notf_id":notf_id}).subscribe(
      async (data: any) => {
        if(data){
          this.api.showToast('success', data.msg);
          this.notification();
        }
        else{
          this.api.showToast('error', 'Invalid request');
        }
      }
    )
  }

  notification(){
    console.log("email::",JSON.parse(localStorage.getItem("user")).email)
    if(JSON.parse(localStorage.getItem("user")).email){
      this.api.get('aware-node/get-notification/'+JSON.parse(localStorage.getItem("user")).email, {}).subscribe(
        async (data: any) => {
          if(data){
            this.notf = data.notification.reverse();
          }
        }
      )
    }
  }

}
