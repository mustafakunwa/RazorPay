import { Component, OnInit } from '@angular/core';
import { WindowRefService, APiService } from './window-ref.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private winRef: WindowRefService,
    private APiService: APiService) { }

  ngOnInit() {

  }

  Payment() {
    this.APiService.createPayment().subscribe(
      res => {
        this.payWithRazor(res);
      }
    )
  }

  payWithRazor(val) {
    const options: any = {
      key: 'rzp_test_Cr6EDaWlDAP2lU',
      amount: val.amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: val.currency,
      name: 'Advait', // company name or product name
      description: 'Device Management',  // product description
      order_id: val.id, // order_id created by you in backend
      modal: { escape: false, },
      notes: {
        // include notes if any
      },
    };
    options.handler = ((response, error) => {
      if (response) {
        options.response = response;
        console.log(response);
        console.log(options);
        this.APiService.Callback(options).subscribe(
          res => {

          }
        )
      }
    });
    options.modal.ondismiss = (() => {
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }
}
