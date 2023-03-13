import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';

declare var Stripe: any;
declare var $: any;
declare var CardJs: any;

@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.css','../payment/payment.component.css']
})
export class ChargeComponent implements OnInit {
  address: string = '';
  postal_code: string = '';
  city: string = '';
  state: string = '';
  country: string = '';

  @ViewChild('cardInfo') cardInfo: ElementRef;
  @Input() charge;
  card: any;
  cardError: string;
  stripe: any;
  user: any = {};
  int_pay_click: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    public api: ApiService,
    private authS: AuthService,
    private modal: NzModalService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    console.log('CHARGE:: ', this.charge);
    // this.initiateCardElement();
    $('#my-card').CardJs();
    $('#my-card').find('.cvc').attr('type', 'password');
    this.user = this.authS.getAuthUser();
  }

  async int_pay(){
    this.int_pay_click = !this.int_pay_click;
  }
  int_pay_form(data:any){
    console.log("form data::",data);
    if(!data.address){
      this.api.showToast('error', 'Please enter a valid Locality.');
    }
    else if(!data.city){
      this.api.showToast('error', 'Please enter a valid city.');
    }
    else if(!data.postal_code){
      this.api.showToast('error', 'Please enter a valid postal code.');
    }
    else if(!data.state){
      this.api.showToast('error', 'Please enter a valid state.');
    }
    else if(!data.country){
      this.api.showToast('error', 'Please enter a valid country.');
    }
    else{
      this.address=data.address;
      this.city=data.city;
      this.postal_code=data.postal_code;
      this.state=data.state;
      this.country=data.country;
      this.api.showToast('success', 'Address box filled successfully.');
    }
  }

  async checkout() {
    let myCard = $('#my-card');
    let cardDetails: any = {};
    cardDetails.number = myCard.CardJs('cardNumber');
    cardDetails.card_type = myCard.CardJs('cardType');
    cardDetails.billing_details_name = myCard.CardJs('name');
    cardDetails.exp_month = myCard.CardJs('expiryMonth');
    cardDetails.exp_year = myCard.CardJs('expiryYear');
    cardDetails.cvc = myCard.CardJs('cvc');
    console.log('Card Info:: ', cardDetails);
    let valid: any = CardJs.isExpiryValid(
      cardDetails.exp_month,
      cardDetails.exp_year
    );
    if (!cardDetails.number.length) {
      this.api.showToast('error', 'Please enter valid card number.');
      return false;
    }
    if (!cardDetails.billing_details_name.length) {
      this.api.showToast('error', 'Please enter valid name.');
      return false;
    }
    if (!cardDetails.cvc.length) {
      this.api.showToast('error', 'Please enter valid CVC.');
      return false;
    }
    else if(!this.address){
      this.api.showToast('error', 'Please first fill all the address boxes and click ok.');
    }
    else if(!this.city){
      this.api.showToast('error', 'Please first fill all the address boxes and click ok.');
    }
    else if(!this.postal_code){
      this.api.showToast('error', 'Please first fill all the address boxes and click ok.');
    }
    else if(!this.state){
      this.api.showToast('error', 'Please first fill all the address boxes and click ok.');
    }
    else if(!this.country){
      this.api.showToast('error', 'Please first fill all the address boxes and click ok.');
    }
    else if (valid && this.address && this.city && this.postal_code && this.state && this.country) {
      this.ngxService.start();
      console.log("charge values::",this.charge);
      var request = {
        "publishable_key":this.charge.publishable_key,
        "amount": this.charge.amount,
        "secret_key": this.charge.secret_key,
        "number": cardDetails.number,
        "exp_month": cardDetails.exp_month,
        "exp_year": cardDetails.exp_year,
        "cvc": cardDetails.cvc
    };
      this.api.post('stripe-node/create-token', request).subscribe((data)=>{
        console.log("create token::",Object.entries(data)[0][1].id," ","secret_key::",request.secret_key," ","amont::",request.amount);
        this.api.post('stripe-node/pay-now',{"amount":request.amount,"token":Object.entries(data)[0][1].id,"secret_key":request.secret_key,"name":cardDetails.billing_details_name,"country":this.country,"postal_code":this.postal_code,"state":this.state,"city":this.city,"address":this.address,"email":JSON.parse(localStorage.getItem('user')).email}).subscribe((data2)=>{
          this.ngxService.stop();
          console.log("payment pi::",Object.entries(data2)[0][1]);
          this.stripe = Stripe(request.publishable_key);
          var result = this.stripe.handleCardPayment(Object.entries(data2)[0][1], {
            payment_method_data: {
                card: {
                    token: Object.entries(data)[0][1].id
                },
            }
        }).then(async (result:any)=> {
          console.log("result::",result);
            if(result.paymentIntent.status === "succeeded"){
              this.api.showToast('success','Payment to the supplier succeded')
              this.modal.closeAll();
              this.api.post('order-node/update-order-payment',{"shopify_order_id":this.charge.shopify_order_id,"customer_id":this.charge.customer_id}).subscribe(
                (update_status : any)=>{
                  if(update_status.msg==="Payment status updated Successfully")
                  this.api.showToast('success',update_status.msg)
                  else
                  this.api.showToast('success',update_status.msg)
                }
              )
            }
            else{
              this.api.showToast('error','Payment to the Supplier Failed.')
            }
      });
          
        })
      });
    } else {
      this.api.showToast('error', 'Please enter valid card expiry date.');
    }
  }

  ngOnDestroy() {
    // if (this.card) {
    //   // We remove event listener here to keep memory clean
    //   this.card.removeEventListener('change', this.cardHandler);
    //   this.card.destroy();
    // }
  }
}
