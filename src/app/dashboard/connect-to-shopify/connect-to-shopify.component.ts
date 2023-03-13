import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-connect-to-shopify',
  templateUrl: './connect-to-shopify.component.html',
  styleUrls: ['./connect-to-shopify.component.css'],
})
export class ConnectToShopifyComponent implements OnInit {
  shopiForm: FormGroup;
  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private eventS: EventService,
    private ngxService: NgxUiLoaderService
  ) {
    this.shopiForm = this.fb.group({
      domain: ['', [Validators.required]],
      store_api_key: ['', [Validators.required]],
      store_api_secret: ['', [Validators.required]],
      access_token: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  connect() {
    if (this.shopiForm.valid) {
      this.ngxService.start();
      this.api.post('integration-node/create-integration', this.shopiForm.value).subscribe(
        (data: any) => {
          console.log('data:: ', data);
          if (data) {
            this.eventS.addedStore();
            this.api.showToast('success', 'Shopify successfully Integrated.');
            this.router.navigate(['/dashboard/stores']);
          } else {
            this.api.showToast('success', 'Error in integrating shopify.');
          }
          this.ngxService.stop();
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.message);
        }
      );
    } else {
      this.shopiForm.markAllAsTouched();
    }
  }
}
