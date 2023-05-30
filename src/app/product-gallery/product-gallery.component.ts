import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Toast } from 'ngx-toastr';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.css']
})
export class ProductGalleryComponent implements OnInit {

  myFiles:string [] = [];
  
   myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required])
  });

  file: any;
  images: any;
  imageurl: any;
  fileurl: string;


  constructor(
    public api: ApiService,
    private ngxService: NgxUiLoaderService
  ) { 
    this.getGallery();
  }

  ngOnInit(): void {
  }

  get f(){
    return this.myForm.controls;
  }

  getGallery(){
    this.api.get('vendor-gallery-node/get-product-images',{}).subscribe((res)=>{
      this.fileurl = environment.fileurl;
      this.imageurl=Object.entries(res)[0][1];
      console.log(Object.entries(res));
    })
  }

  uploadPicChanged(event : any) {
    for (var i = 0; i < event.target.files.length; i++) { 
      this.myFiles.push(event.target.files[i]);
  }
  }

  prd_img_data(){
    const formData = new FormData();
 
    for (var i = 0; i < this.myFiles.length; i++) { 
      formData.append("prod_img", this.myFiles[i]);
    }
    this.api.post('vendor-gallery-node/upload-product-image', formData).subscribe(
      async (data: any) => {
        if (data.hasOwnProperty('error')) {
          return false;
        }
        console.log("response from upload image::",data);
        this.ngxService.stop();
        this.getGallery();
      },
      (err) => {
        this.ngxService.stop();
      }
    );
  }

  copy(input:any){
    const content1 = document.createElement('textarea');
    content1.style.position = 'fixed';
    content1.style.left = '0';
    content1.style.top = '0';
    content1.style.opacity = '0';
    content1.value = input;
    document.body.appendChild(content1);
    content1.focus();
    content1.focus();
    content1.select();
    document.execCommand('copy');
    document.body.removeChild(content1);
    this.api.showToast('success', "Copied to Clipboard");
  }

}
