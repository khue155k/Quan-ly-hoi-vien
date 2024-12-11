import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../company.service';
import { DataService } from '../data.service';
import { MembershipFeeService } from '../membership-fee.service';
import { Chart, registerables } from 'chart.js';
@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  fees: any[] = [];
  selectedYear: number = 0;
  feeChart: any;
  paidCount: number = 0;
  unpaidCount: number = 0;

  constructor(private companyService: CompanyService,private dataService: DataService,private membershipFeeService: MembershipFeeService ) {
    Chart.register(...registerables);
  }
  
  ngOnInit(): void {
    this.loadStatusCounts();
    this.loadYearsMembershipFee();
  }
  cards = [
    { label: 'Từ chối', value: 0, count: 0 },
    { label: 'Chưa duyệt', value: 1, count: 0 },
    { label: 'Đã duyệt', value: 2, count: 0 },
    { label: 'Thành viên cũ (trước 2014)', value: 3, count: 0 },
    { label: 'Tổng', value: 4, count: 0 },
  ];

  loadStatusCounts(): void{
    this.cards.forEach(c => {
      this.companyService.getCompanyListByStatus(c.value, 1, 10).subscribe(response => {
        c.count = response.totalCompanies;
      });
    });
  }

  sendDataStatus(status: number): void{
    this.dataService.updateDataCompanyStatus(status);
  }

  loadYearsMembershipFee(): void{
    this.membershipFeeService.getFeeList().subscribe(response => {
      this.fees = response.items;
      if (this.fees.length > 0) {
        this.selectedYear = this.fees[0].year;
        this.onYearChange();
      }
    });
  }

  getMemberShipFeeListByNameYear(): void {
    this.membershipFeeService.getMembershipFeeListByNameYear("", this.selectedYear, 1, 10).subscribe(response => {
      this.paidCount = response.totalCompanies;
    });
  }

  getMemberShipFeeListByNameYearNotPay(): void {
    this.membershipFeeService.getMembershipFeeListByNameYearNotPay("", this.selectedYear, 1, 10).subscribe(response => {
      this.unpaidCount = response.totalCompanies;
    });
  }

  // onYearChange(event: Event): void {  
  //   const selectElement = event.target as HTMLSelectElement;
  //   this.selectedYear = Number(selectElement.value);
  onYearChange(): void {  
    this.membershipFeeService.getPaidCompanyCount(this.selectedYear).subscribe(response =>{4
      this.updateChart(response.paidCount,response.unpaidCount);
    })
  }

  updateChart(paidCount: number, unpaidCount: number): void {
    if (this.feeChart) {
      this.feeChart.destroy(); 
    }
    
    this.feeChart = new Chart('feeChart', {
      type: 'pie',
      data: {
        labels: ['Đã đóng phí', 'Chưa đóng phí'],
        datasets: [{
          label: 'Số lượng công ty',
          data: [paidCount, unpaidCount],
          backgroundColor: ['#4CAF50', '#F44336'],
        }]
      }
    });
  }
}
