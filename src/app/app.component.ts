import { Component,OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {countriesData} from '../app/Model/Country';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'paypalproject';
  PageData:countriesData[];
  nameInput:string;
  populationInput:String;
  areaInput:string;
  currencyInput:string;
  clonePageData:countriesData[];
  checked:boolean;
  constructor(private test:HttpClient)
  {
  }
  ngOnInit() {
    this.getAllCounties();
  }
  getAllCounties()
  {
    if(!localStorage.getItem('data'))
    {
      this.GetData().subscribe((data:countriesData[])=>{

     this.clonePageData= this.PageData=this.ParseResponse(data);
        localStorage.setItem('data',JSON.stringify(this.PageData));
      })
    }
    else
    this.clonePageData=this.PageData=JSON.parse(localStorage.getItem('data'))
  }
  filteredData(val='')
  {

    this.PageData=this.clonePageData||this.PageData;
    if(!val)
    this.getAllCounties();
    else if(val=="name")
    {
      this.clonePageData= this.PageData.filter((y)=>{
        return  y["name"].toLowerCase().indexOf(this.nameInput.toLowerCase())>-1;
      })
    }
    else if(val=="population")
    {
      this.clonePageData= this.PageData.filter((y)=>{
        return y["population"]> Number(this.populationInput);
      })
    }
    else if(val=="currency")
    {
      this.clonePageData= this.PageData.filter((y)=>{
        return y["currencies"] ?y["currencies"].toLowerCase().indexOf(this.currencyInput.toLowerCase())>-1:false;
      })
    }
    else if(val=="area")
    {
      this.clonePageData= this.PageData.filter((y)=>{
        return y["area"] > Number(this.areaInput);
      })
    }
  }

  sortData(property,checked)
  {
    this.checked=!checked;
    if(this.checked)
    this.clonePageData.sort((x,y)=> {
      if(x[property] > y[property])
      return 1
      else if(x[property] < y[property])
      return -1
      else
      return 0
     });
    else
    this.clonePageData.sort((x,y)=> {
       if(x[property] < y[property])
       return 1
       else if(x[property] > y[property])
       return -1
       else
       return 0
      });
  }
  GetData():Observable<countriesData[]>
  {
    return this.test.get<countriesData[]>('https://restcountries.eu/rest/v2/all',{observe:'body'});
  }
   ParseResponse(resp)
  {
    let CountryData:countriesData[]=[];

    for(let data of resp)
    {

      CountryData.push(new countriesData(data.name,data.currencies[0].code,data.area,
      data.subregion,data.region,data.population));
    }
    return CountryData;
  }
}
