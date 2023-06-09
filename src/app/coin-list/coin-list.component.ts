import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss']
})
export class CoinListComponent implements OnInit{
  dataSource!: MatTableDataSource<any>;
  currency:string ="INR";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  bannerData: any=[];
  displayedColumns: string[] = ['symbols', 'current_price', 'price_change_percentage_24h', 'market_cap'];


  constructor(private api : ApiService, private router: Router, private currencyService: CurrencyService){}

  ngOnInit(){
    this.getAllData();
    this.getBannerData();
    this.currencyService.getCurrency()
    .subscribe(val=>{
      this.currency = val;
      this.getAllData();
      this.getBannerData();
    })
  }

  getBannerData(){
    this.api.getTrendinCurrency(this.currency)
    .subscribe(res=>{
      console.log(res);
      this.bannerData = res;
    })
  }

  getAllData(){
    this.api.getCurrency(this.currency)
    .subscribe(res=>{
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDetail( element:any){
    this.router.navigate(['coin-detail',element.id]);
  }
}
