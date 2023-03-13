import { Injectable } from "@angular/core";
import socketIOClient from "socket.io-client";
import {Observable } from "rxjs";


@Injectable()

export class chatService{

    //private socket =socketIOClient('https://system.udify.io');

    private socket =socketIOClient('http://localhost:8000');


    constructor(){}

    send_message_customer(msg:any,send_to:any,send_by:any){
        console.log("msg send by::",send_by)
        this.socket.emit('customer', {"msg":msg,"send_to":send_to,"send_by":send_by});
    }

    send_message_vendor(msg:any,send_to:any,send_by:any){
        //console.log("msg send by::",send_by)
        this.socket.emit('vendor', {"msg":msg,"send_to":send_to,"send_by":send_by});
    }

    get_customer_chat(){
        let observable=new Observable<{message:String}>(observer=>{
            this.socket.on('vendor',(data)=>{
                observer.next(data.message);
                //console.log("message from vendor::",data.message)
            });
            return () => {this.socket.disconnect();}
        });
        return observable;
    }

    get_vendor_chat(){
        let observable=new Observable<{message:String}>(observer=>{
            this.socket.on('customer',(data)=>{
                observer.next(data.message);
                console.log("message from customer::",data.message)
            });
            return () => {this.socket.disconnect();}
        });
        return observable;
    }

    get_customer_chat_towhoom(){
        let observable_towhoom=new Observable<{send_to:String}>(observer=>{
            this.socket.on('vendor',(data)=>{
                observer.next(data.send_to);
                //console.log("message sent to::",data.send_to)
            });
            return () => {this.socket.disconnect();}
        });
        return observable_towhoom;
    }
    get_customer_chat_bywhoom(){
        let observable_bywhoom=new Observable<{send_by:String}>(observer=>{
            this.socket.on('vendor',(data)=>{
                observer.next(data.send_by);
                //console.log("message sent by::",data.send_by)
            });
            return () => {this.socket.disconnect();}
        });
        return observable_bywhoom;
    }
    get_vendor_chat_towhoom(){
        let observable_ven_towhoom=new Observable<{send_to:String}>(observer=>{
            this.socket.on('customer',(data)=>{
                observer.next(data.send_to);
                console.log("message sent to::",data.send_to)
            });
            return () => {this.socket.disconnect();}
        });
        return observable_ven_towhoom;
    }
    get_vendor_chat_bywhoom(){
        let observable_ven_bywhoom=new Observable<{send_by:String}>(observer=>{
            this.socket.on('customer',(data)=>{
                observer.next(data.send_by);
                console.log("message sent by::",data.send_by)
            });
            return () => {this.socket.disconnect();}
        });
        return observable_ven_bywhoom;
    }
}