import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HospitalList } from '../../core/model/hospital';
import { LibService } from '../../shared/services/lib.service';
import { ModalNewHospitalComponent } from './modals/modal-new-hospital/modal-new-hospital.component';
import { HospitalService } from './services/hospital.service';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styleUrls: ['./hospitals.component.css']
})
export class HospitalsComponent {
  @ViewChild('mdlNewHospital') private mdlNewHospital!: ModalNewHospitalComponent;

  zoneCode: any = '';
  hospitalDataSet: HospitalList[] = [];
  zones: any = [];

  constructor (
    private router: Router,
    private hospitalService: HospitalService,
    private libService: LibService,
    private message: NzMessageService) { }

  ngOnInit() {
    this.getHospitalList();
    this.getZones();
  }

  onBack(): void {
    this.router.navigate(['/dashboard'])
  }

  openEditHospital(id: any) {
    this.mdlNewHospital.showModal(id)
  }

  openNewHospitalRegister() {
    this.mdlNewHospital.showModal()
  }

  onSubmitRegister(event: any) {
    if (event) {
      this.getHospitalList()
    }
  }

  onChangeZone(event: any) {
    this.zoneCode = event;
    this.getHospitalList();
  }

  async getZones() {
    try {
      const response = await this.libService.getZones()
      this.zones = response.data.map((v: any) => {
        v.name = `${v.name} (${v.ingress_zone})`
        return v
      });
    } catch (error: any) {
      this.message.error(`${error.code} - ${error.message}`)
    }
  }

  async getHospitalList() {
    const messageId = this.message.loading('Loading...', { nzDuration: 0 }).messageId
    try {
      const response = await this.hospitalService.getList(this.zoneCode)
      this.hospitalDataSet = response.data
      this.message.remove(messageId)
    } catch (error: any) {
      this.message.remove(messageId)
      this.message.error(`${error.code} - ${error.message}`)
    }
  }
}
