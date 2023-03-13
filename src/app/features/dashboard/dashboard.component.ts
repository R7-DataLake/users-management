import { Component, OnInit } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import * as _ from 'lodash';
import { DateTime, Interval } from 'luxon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HospitalSendList, HospitalNotSendData } from '../../core/model/usage';
import { ReportService } from '../../shared/services/report.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  historyDataSet: HospitalSendList[] = [];

  hospitalNotSendDataSet: HospitalNotSendData[] = [
    {
      hospcode: '11054',
      hospname: 'รพ.เชียงยืน',
      last_update: '13 ม.ค. 2566 เวลา 12:45:05',
    },
    {
      hospcode: '10705',
      hospname: 'รพศ.ร้อยเอ็ด',
      last_update: '12 ม.ค. 2566 เวลา 11:49:45',
    },

  ];

  dates: any = [];
  start: any;
  end: any;

  loadingLastSending = false;
  loadingTotalUsers = false;

  loadingLastSend = false;
  loadingDoNotSend = false;

  lastSendingChartInstance!: ECharts;
  totalUserChartInstance!: ECharts;

  lastSendingLineChartOption: EChartsOption = {};
  totalUserPieChartOption: EChartsOption = {};

  constructor (
    private reportService: ReportService,
    private message: NzMessageService
  ) {
    const _start = DateTime.now().minus({ days: 10 });
    const _end = DateTime.now();
    this.start = _start.toFormat('yyyyMMdd');
    this.end = _end.toFormat('yyyyMMdd');

    const interval = Interval.fromDateTimes(_start, _end).splitBy({ day: 1 }).map(d => d.start);

    let data = [];
    for (const d of interval) {
      const _d = d.toFormat('yyyy-MM-dd');
      data.push(_d);
    }

    this.dates = data;
  }

  ngOnInit() {
    this._getLastSend();
    this._getHospitalDoNotSend();
  }

  onLastSendingChartInit(echart: any) {
    this.lastSendingChartInstance = echart;
    this.getLastSending();
  }

  onTotalUsersChartInit(echart: any) {
    this.totalUserChartInstance = echart;
    this.getTotalUsers();
  }

  private async getTotalUsers() {
    this.loadingTotalUsers = true;
    try {
      const response: any = await this.reportService.getTotalUsers();
      this.loadingTotalUsers = false;
      const data: any = response.data.results || [];
      this._setUserPieChart(data);
    } catch (error) {
      this.loadingTotalUsers = false;
      console.log(error);
      this.message.error('เกิดข้อผิดพลาด [TOTAL USERS]');
    }
  }

  private async getLastSending() {
    this.loadingLastSending = true;
    try {
      const response: any = await this.reportService.getLastSendings(this.start, this.end);
      this.loadingLastSending = false;
      const data: any = response.data.results || [];
      this._setLastSendingChart(data);
    } catch (error) {
      this.loadingLastSending = false;
      console.log(error);
      this.message.error('เกิดข้อผิดพลาด [TOTAL USERS]');
    }
  }

  private async _setLastSendingChart(data: any) {

    const labelGroup: any = _.groupBy(data, 'zone_name');
    const keys = Object.keys(labelGroup);

    const series: any = [];

    for await (const l of keys) {

      let obj: any = {
        name: l,
        type: 'line',
        smooth: true,
        data: []
      };

      for await (const d of this.dates) {
        const idx = _.findIndex(data, { zone_name: l, request_date: d })
        if (idx > -1) {
          obj.data.push(Number(data[idx].total));
        } else {
          obj.data.push(0);
        }
      }

      series.push(obj);

    }

    let labels: any = this.dates.map((d: any) => {
      return DateTime.fromISO(d, { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_SHORT);
    });

    this.lastSendingChartInstance.setOption({
      title: {
        text: 'สถิติการส่งข้อมูล',
        textStyle: {
          fontFamily: "Kanit"
        },
        subtext: 'จำนวนเป็นครั้ง',
        subtextStyle: {
          fontFamily: "Kanit"
        }
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      legend: {
        data: keys,
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {}
      //   }
      // },
      xAxis: {
        type: 'category',
        nameTextStyle: {
          fontFamily: "Kanit"
        },
        boundaryGap: true,
        data: labels,
      },
      yAxis: {
        type: 'value'
      },
      series: series
    })
  }

  private async _setUserPieChart(data: any[]) {

    let seriesData: any[] = [];
    for (const item of data) {
      let obj: any = {};
      obj.name = item.zone_name;
      obj.value = Number(item.total);
      seriesData.push(obj);
    }

    this.totalUserChartInstance.setOption({
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      title: {
        text: 'จำนวนผู้ใช้งานในระบบ',
        left: 'center',
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      series: [
        {
          name: 'จำนวนผู้ใช้งานในระบบ',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: seriesData
        },
      ],
    });

  }

  private async _getLastSend() {
    this.loadingLastSend = true;
    try {
      const response: any = await this.reportService.getLastSend();
      this.loadingLastSend = false;
      const data: any = response.data.results || [];
      this.historyDataSet = data.map((v: any) => {
        v.last_update = DateTime.fromISO(v.last_update, { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
        return v;
      });
    } catch (error) {
      this.loadingLastSend = false;
      console.log(error);
      this.message.error('เกิดข้อผิดพลาด [TOTAL USERS]');
    }
  }

  private async _getHospitalDoNotSend() {
    this.loadingDoNotSend = true;
    try {
      const response: any = await this.reportService.getDoNotSend();
      this.loadingDoNotSend = false;
      const data: any = response.data.results || [];
      this.hospitalNotSendDataSet = data.map((v: any) => {
        v.last_update = DateTime.fromISO(v.last_update, { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
        return v;
      });
    } catch (error) {
      this.loadingDoNotSend = false;
      console.log(error);
      this.message.error('เกิดข้อผิดพลาด [TOTAL USERS]');
    }
  }
}
