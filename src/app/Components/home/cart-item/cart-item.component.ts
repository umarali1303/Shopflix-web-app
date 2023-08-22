import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Service/api.service';
import { Cart } from 'src/app/Model/cart';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  private auth: string;
  cartlist: Cart[];
  totalSum: number = 0;
  constructor(private api: ApiService, private route: Router) {

  }

  ngOnInit() {
    this.auth = this.api.getToken();
    this.api.getCartItems(this.auth).subscribe(res => {
      console.log(res);
      this.cartlist = res.oblist;
      this.cartlist.forEach(value => {
        this.totalSum = this.totalSum + (value.quantity * value.price);
      });
    });

  }
  delete(id) {
    console.log(id+"");
    this.api.delCart(this.auth, id).subscribe(res => {
      console.log(res);
      this.totalSum = 0;
      this.cartlist = res.oblist;
      if(this.cartlist.length==0) this.totalSum = 0;
      else {
      this.cartlist.forEach(value => {
        this.totalSum = this.totalSum + (value.price);
      });
    }
    });
  }

  place() {
    this.api.place(this.auth).subscribe(res => {
      console.log(res);
    });
    this.route.navigate(['/home']);
  }

}
