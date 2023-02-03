import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { UserSendList, HospitalNotSendData } from '../../core/model/usage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  userUsageChartOption: EChartsOption = {
    title: {
      text: 'สถิติการใช้งาน',
      textStyle: {
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
      data: ['มหาสารคาม', 'ขอนแก่น', 'ร้อยเอ็ด', 'กาฬสินธุ์'],
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
      data: ['11 ม.ค.', '12 ม.ค.', '13 ม.ค.', '14 ม.ค.', '15 ม.ค.', '16 ม.ค.', '17 ม.ค.'],
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'มหาสารคาม',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'ขอนแก่น',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'ร้อยเอ็ด',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'กาฬสินธุ์',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [320, 332, 301, 334, 390, 330, 320]
      },
    ]
  };

  userPiChartOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontFamily: "Kanit"
      }
    },
    title: {
      text: 'จำนวนผู้ใช้งานในระบบ',
      subtext: 'ณ วันที่ 21 ม.ค. 2566 เวลา 18:00 น.',
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
            fontSize: 30,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: [
          { value: 1048, name: 'ขอนแก่น' },
          { value: 735, name: 'มหาสารคาม' },
          { value: 580, name: 'ร้อยเอ็ด' },
          { value: 484, name: 'กาฬสินธุ์' },
        ]
      },
    ],
  };

  historyDataSet: UserSendList[] = [
    {
      username: 'u11053',
      hospcode: '11053',
      hospname: 'รพ.กันทรวิชัย',
      last_update: '13 ม.ค. 2566 เวลา 12:45:05',
      total_records: 500,
    },
    {
      username: 'u10707',
      hospcode: '10707',
      hospname: 'รพท.มหาสารคาม',
      last_update: '12 ม.ค. 2566 เวลา 11:49:45',
      total_records: 1500,
    },

  ];

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
}
