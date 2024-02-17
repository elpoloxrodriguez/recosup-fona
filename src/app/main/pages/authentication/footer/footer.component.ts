import { Component, OnInit } from '@angular/core';
import { VERSION } from '@angular/core';
import { UtilService } from '@core/services/util/util.service';
import { environment } from 'environments/environment'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {


  public currentDate: Date;
  public build
  public fechaX
  public fechafinal


  constructor(
    private utilservice: UtilService
  ) { }
  public Version

  ngOnInit(): void {
    this.currentDate = new Date();
    this.fechafinal = environment.buildDateTime
    this.fechaX = 'Build: ' + this.utilservice.FechaMoment(environment.buildDateTime)
    this.build = this.utilservice.FechaMomentL(environment.buildDateTime).replace(/\//g, '.')
    this.Version = VERSION.full

  }

}
