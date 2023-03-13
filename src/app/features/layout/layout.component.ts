import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  constructor (
    private router: Router,
    private modal: NzModalService
  ) { }

  logout() {

    this.modal.confirm({
      nzTitle: 'ยืนยัน?',
      nzContent: `ต้องการออกจากระบบ ใช่หรือไม่?`,
      nzOkText: 'ใช่',
      nzOkType: 'primary',
      nzOkDanger: false,
      nzOnOk: () => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      },
      nzCancelText: 'ไม่ใช่',
      nzOnCancel: () => { }
    });
  }

}
