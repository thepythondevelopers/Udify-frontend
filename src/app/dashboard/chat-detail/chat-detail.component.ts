import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { chatService } from 'src/app/chat.service';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.css'],
  providers:[chatService]
})
export class ChatDetailComponent implements OnInit, OnChanges {
  messageArray:Array<{message:String}>=[];
  messageNotification:Array<{notification:String}>=[];
  send_to_Array:Array<{send_to:String}>=[];
  send_by_Array:Array<{send_to:String}>=[];
  @ViewChild('scrollMe', { static: true })
  private myScrollContainer: ElementRef;
  @Input() chat: any;

  messages: any = [];
  user: any = {};
  message: any = '';
  loading: boolean = true;
  isloaded: boolean = false;
  userid_supplier: any;
  sup_id: any;
  loggedin_id: any;
  constructor(private chatService:chatService, private api: ApiService, private auth: AuthService) {
    let user = JSON.parse(localStorage.getItem('user'));
    this.loggedin_id = user._id;
    this.chatService.get_customer_chat().subscribe(data=>{
      console.log("data::",data)
      this.messageArray.push(<any>data)
      this.messageNotification.push({notification:"new message"})
    })
    this.chatService.get_customer_chat_towhoom().subscribe(data=>{
      this.send_to_Array=[];
      //console.log("sent_to::",data)
      if(data)
      this.send_to_Array.push(<any>data)
    })
    this.chatService.get_customer_chat_bywhoom().subscribe(data=>{
      this.send_by_Array=[];
      //console.log("sent_by::",data)
      if(data)
      this.send_by_Array.push(<any>data)
    })
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes:: ', changes);
    console.log("Supplier id::",changes.chat.currentValue.account_id);
    this.sup_id = changes.chat.currentValue._id;
    this.messages = [];
    if (Object.keys(this.chat).length) {
      this.loading = true;
      if (this.chatSubs) {
        this.chatSubs.unsubscribe();
      }
      this.isloaded = false;
      this.getChat();
    }
  }

  getUser() {
    this.user = this.auth.getAuthUser();
    console.log('user:: ', this.user);
  }

  chatSubs: any;
  getChat() {
    this.messageArray=[];
    this.chatSubs = this.api
      .post('chat-node/get-chat/' + this.chat._id, {})
      .subscribe(
        (data: any) => {
          this.loading = false;
          console.log('getChat data:: ', data);
          if (data.length) {
            this.messages = data;
            setTimeout(() => {
              this.scrollToBottom();
            }, 100);
            // for (let i = 0; i < data.length; i++) {
            //   // this.messages = data[i].doc;
            //   // Array.prototype.push.apply(this.messages, data[i].doc);
            // }
          } else {
            this.messages = [];
          }
          this.isloaded = true;
        },
        (err) => {
          this.loading = false;
          this.isloaded = true;
          console.log('getChat err:: ', err);
        }
      );
  }

  sendMessage() {
    if (this.message.length) {
      this.isloaded = false;
      this.api
        .post('chat-node/save-chat/', {
          send_to: this.chat._id,
          message: this.message,
        })
        .subscribe(
          (data: any) => {
            console.log('sendMessage data:: ', data);
            this.chatService.send_message_customer(data.message,data.send_to,data.send_by)
            this.messageArray=[];
            if (data.hasOwnProperty('error')) {
              this.api.showToast('error', data.error);
              return false;
            }
            this.message = '';
            this.getChat();
          },
          (err) => {
            console.log('sendMessage err:: ', err);
          }
        );
    }
  }

  reloadChat() {
    this.isloaded = false;
    this.loading = true;
    this.messageArray=[];
    this.getChat();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
      this.messageNotification=[];
    } catch (err) {}
  }
}
