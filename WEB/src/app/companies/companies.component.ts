import { Component, OnInit, input } from '@angular/core';
import { CompanyService } from '../company.service';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';

@Component({
  standalone: false,
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent implements OnInit {
  userInfo: any;
  companies: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  selectedCompany: any = null;
  isAdmin: boolean = false;

  selectedStatus: number = 4;
  searchString: string = '';

  constructor(private companyService: CompanyService, private dataService: DataService, private authService: AuthService) {
    this.userInfo = this.authService.getDecodedToken();
    const isAdminLocalStorage = this.userInfo.role;
    this.isAdmin = isAdminLocalStorage === 'Admin';
    
    this.dataService.data$.subscribe(data => {
      this.selectedStatus = data;
    });
  }

  ngOnInit(): void {
    this.searchCompanyByNameStatus();
  }

  getCompanyList(): void {
    this.companyService.getCompanyList(this.currentPage, this.pageSize).subscribe(response => {
      this.companies = response.items;
      this.totalPages = Math.ceil(response.totalCompanies / this.pageSize);
    });
  }

  getCompanyDetailById(id: number): void {
    this.companyService.getCompanyDetailById(id).subscribe(response => {
      this.selectedCompany = response;
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Từ chối';
      case 1: return 'Chưa duyệt';
      case 2: return 'Đã duyệt';
      case 3: return 'Thành viên cũ (trước 2014)';
      default: return 'Không xác định';
    }
  }

  searchCompanyByNameStatus(): void {
    this.companyService.getCompanyListByNameStatus(this.searchString, this.selectedStatus, this.currentPage, this.pageSize).subscribe(response => {
      this.companies = response.items;
      this.totalPages = Math.ceil(response.totalCompanies / this.pageSize);
    });
  }

  searchCompany(): void {
    this.currentPage = 1;
    this.searchCompanyByNameStatus();
  }

  private updateCompanyStatus(status: number) {
    if (this.isAdmin) {
      this.companyService.updateCompanyStatus(this.selectedCompany.id, status).subscribe(
        (response) => {
          if (response.status == 200) {
            alert('Cập nhật trạng thái thành công!');
            this.getCompanyDetailById(this.selectedCompany.id);
            this.searchCompanyByNameStatus();
          } else {
            alert('Có lỗi xảy ra khi cập nhật trạng thái công ty.');
          }
        }
      );
    }
  }

  onApprove(): void {
    this.updateCompanyStatus(2);
  }

  onReject(): void {
    this.updateCompanyStatus(0);
  }

  onCancelApprove(): void {
    this.updateCompanyStatus(1);
  }

  scrollToTarget() {
    const element = document.getElementById('companyDetail');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.searchCompanyByNameStatus();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchCompanyByNameStatus();
    }
  }

  prePage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchCompanyByNameStatus();
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
