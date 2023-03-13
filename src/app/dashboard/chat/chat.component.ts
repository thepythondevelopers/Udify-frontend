import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() vendor: any;
  selectedChat: any = {};
  constructor() { }

  ngOnInit(): void {
  }

  openChat(event: any) {
    console.log('event:: ', event);
    this.selectedChat = event;
  }

}
