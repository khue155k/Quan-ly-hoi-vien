import { Component, OnInit } from '@angular/core';
import { MembershipFeeService } from '../membership-fee.service';
import { CompanyService } from '../company.service';

@Component({
  standalone: false,
  selector: 'app-membership-fee',
  templateUrl: './membership-fee.component.html',
  styleUrl: './membership-fee.component.css'
})
export class MembershipFeeComponent implements OnInit {
  fees: any[] = [];
  selectedYear: number = 0;
  newYear: number = 0;
  fee_amount: any;
  new_fee_amount: any;
  fee_id: any;

  companies: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  selectedCompany: any = null;
  searchString: string = '';
  selectedStatus: number = 0;

  seletedPaymentMethod: string = "Chuyển khoản";

  constructor(private membershipFeeService: MembershipFeeService) {
  }

  ngOnInit(): void {
    this.getFeeList();
    this.searchCompany();
  }

  getFeeList(): void {
    this.membershipFeeService.getFeeList().subscribe(response => {
      this.fees = response.items;
      if (this.fees.length > 0) {
        this.selectedYear = this.fees[0].year;
      }
      this.onChange();
    });
  }

  onChange(): void {
    this.fee_amount = this.fees.find(x => x.year == this.selectedYear).fee_amount;
    this.fee_id = this.fees.find(x => x.year == this.selectedYear).id;
    this.searchCompany();
  }

  getYearFeeNext(): void {
    const currentYear = new Date().getFullYear();
    this.newYear = Math.max(...this.fees.map(fee => fee.year)) + 1 || currentYear;
  }

  addFee(): void {
    const feeData = { id: 0, year: this.newYear, fee_amount: this.new_fee_amount };

    this.membershipFeeService.addFee(feeData).subscribe(
      (response) => {
        if (response) {
          alert('Thêm hội phí thành công!');
          this.getFeeList();
          this.fee_amount = response.fee_amount;
        } else {
          alert('Thêm hội phí thất bại!');
        }
      }
    );
  }

  payFee(): void {
    const confirmation = confirm('Xác nhận đóng hội phí?');
    if (!confirmation) {
      return;
    }

    const paymentRequest = {
      company_id: this.selectedCompany.id,
      fee_id:  this.fee_id,
      status: 1,
      payment_method: this.seletedPaymentMethod
    };

    this.membershipFeeService.payMembershipFee(paymentRequest).subscribe(response =>{
      if (response){
        alert('Đóng hội phí thành công!');
      }else{
        alert(`Có lỗi khi đóng hội phí!`);
      }
    })
  }

  convertStatusFee(statusFee: number): string {
    switch (statusFee) {
      case 0: return "Chưa đóng";
      case 1: return "Đã đóng";
      default: return "Không xác định";
    }
  }

  getMemberShipFeeListByNameYear(): void {
    this.membershipFeeService.getMembershipFeeListByNameYear(this.searchString, this.selectedYear, this.currentPage, this.pageSize).subscribe(response => {
      this.companies = response.items;
      this.totalPages = Math.ceil(response.totalCompanies / this.pageSize);
    });
  }

  getMemberShipFeeListByNameYearNotPay(): void {
    this.membershipFeeService.getMembershipFeeListByNameYearNotPay(this.searchString, this.selectedYear, this.currentPage, this.pageSize).subscribe(response => {
      this.companies = response.items;
      this.totalPages = Math.ceil(response.totalCompanies / this.pageSize);
    });
  }

  searchCompany(): void {
    this.currentPage = 1;
    if (this.selectedStatus == 0) {
      this.getMemberShipFeeListByNameYearNotPay()
    } else {
      this.getMemberShipFeeListByNameYear();
    }
  }

  showMembershipPay(company: any): void {
    this.selectedCompany = company;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    if (this.selectedStatus == 0) {
      this.getMemberShipFeeListByNameYearNotPay()
    } else {
      this.getMemberShipFeeListByNameYear();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.selectedStatus == 0) {
        this.getMemberShipFeeListByNameYearNotPay()
      } else {
        this.getMemberShipFeeListByNameYear();
      }
    }
  }

  prePage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.selectedStatus == 0) {
        this.getMemberShipFeeListByNameYearNotPay()
      } else {
        this.getMemberShipFeeListByNameYear();
      }
    }
  }

  getListPage(): number[] {
    const totalPagesView = 5;
    const pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    let startPage = Math.max(1, this.currentPage - totalPagesView / 2);
    let endPage = Math.min(this.totalPages, this.currentPage + totalPagesView / 2)

    if (startPage === 1) {
      endPage = Math.min(totalPagesView, this.totalPages);
    } else if (endPage === this.totalPages) {
      startPage = Math.max(1, this.totalPages - totalPagesView + 1);
    }

    return pageNumbers.slice(startPage - 1, endPage);
  }
}
