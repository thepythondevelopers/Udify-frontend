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
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  @ViewChild('cardInfo') cardInfo: ElementRef;
  @Input() plan;
  card: any;
  cardHandler = this.onChange.bind(this);
  cardError: string;
  stripe: any;
  user: any = {};

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
    console.log('PLN:: ', this.plan);
    // this.initiateCardElement();
    $('#my-card').CardJs();
    $('#my-card').find('.cvc').attr('type', 'password');
    this.user = this.authS.getAuthUser();
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
    if (valid) {
      this.ngxService.start();
      this.api
        .post('stripe-node/stripe', {
          public_id: this.user.guid,
          customerId: this.user.account_id.stripe_customer_id,
          plan_id: this.plan.id,
          priceId: this.plan.price_id,
          ...cardDetails,
        })
        .subscribe(
          async (data: any) => {
            this.ngxService.stop();
            if (data.hasOwnProperty('error')) {
              this.api.showToast('error', data.error);
              return false;
            }
            let user: any = await this.auth.getAuthUser();
            if (data.hasOwnProperty('message')) {
              this.api.showToast('success', data.message);
              if (this.plan.purchase) {
                this.router.navigate([
                  user
                    ? user.access_group == 'supplier'
                      // ? '/vendor/connect-to-shopify'
                      ? '/vendor'
                      : '/dashboard/connect-to-shopify'
                    : '/home',
                ]);
              }
              this.modal.closeAll();
            }
          },
          (err) => {
            this.ngxService.stop();
            console.log('Login err:: ', err);
            this.api.showToast('error', err.error.error);
          }
        );
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

  initiateCardElement() {
    // Giving a base style here, but most of the style is in scss file
    const cardStyle = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    this.stripe = Stripe('pk_test_Qqj1em4vicG934KrhCVMTIgu');
    const elements = this.stripe.elements();
    this.card = elements.create('card', { hidePostalCode: true, cardStyle });
    console.log(this.cardInfo);
    this.card.mount('#card-info');
    this.card.addEventListener('change', this.cardHandler);
  }

  onChange({ error }) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
    this.cd.detectChanges();
  }

  async createStripeToken() {
    const { token, error } = await this.stripe.createToken(this.card);
    if (token) {
      this.onSuccess(token);
    } else {
      this.onError(error);
    }
  }

  onSuccess(token) {
    console.log('Card Token:: ', token, '\nUser:: ', this.user);

    this.api
      .post('stripe-node/stripe', {
        user_id: this.user.guid,
        stripe_customer_id: this.user.account_id.stripe_customer_id,
        plan_id: this.plan.id,
        ...token,
      })
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
        },
        (err) => {
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
  }

  onError(error) {
    if (error.message) {
      this.cardError = error.message;
    }
  }
}
