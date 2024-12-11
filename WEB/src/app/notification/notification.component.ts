import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  userInfo: any;

  constructor(private notiService: NotificationService, private authService: AuthService) {
    this.userInfo = this.authService.getDecodedToken();
    const isAdminLocalStorage = this.userInfo.role;
    this.isAdmin = isAdminLocalStorage === 'Admin';
  }

  ngOnInit(): void {
    this.searchNotiByNameStatus();
  }

  newNotification = {
    admin_id: '',
    title: '',
    message: '',
    img_url: null,
    status: 1
  };

  quillEditorInstance: any;
  editorModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: {
        'link': this.imageHandler.bind(this)
      }
    }
  };
  imageHandler() {
    const imageUrl = prompt('Nhập đường dẫn ảnh (URL):');
    if (imageUrl && this.quillEditorInstance) {
      const range = this.quillEditorInstance.getSelection();
      if (range) {
        this.quillEditorInstance.insertEmbed(range.index, 'image', imageUrl);
        this.newNotification.message = this.quillEditorInstance.root.innerHTML;
      }
    }
  }
  onEditorCreated(quillInstance: any) {
    this.quillEditorInstance = quillInstance;
  }

  selectedNoti: any = null;
  selectedStatus: number = 1;
  searchString: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  notifications: any[] = [];
  isAdmin: boolean = false;


  searchNotiByNameStatus(): void {
    this.notiService.getNotisByNameStatus(this.searchString, this.selectedStatus, this.currentPage, this.pageSize).subscribe((response) => {
      if (response.status == 200) {
        this.notifications = response.body.items;
        this.totalPages = Math.ceil(response.body.totalNotis / this.pageSize);
      }

    });
  }

  searchNotification(): void {
    this.currentPage = 1;
    this.searchNotiByNameStatus();
  }

  createNoti(): void {
    this.newNotification.admin_id = this.userInfo.nameid;
    if (this.newNotification.message.trim() == '') { alert("Nội dung không được để trống"); return; }
    this.notiService.createNoti(this.newNotification).subscribe((reponse) => {
      if (reponse.status == 201) {
        alert("Tạo thông báo thành công");
        this.searchNotification();
      } else {
        alert("Tạo thông báo thất bại");
      }
    })
  }

  updateStatusNoti(id: number, status: number) {
    status = 1 - status;
    this.notiService.updateStatusNoti(id, status).subscribe((response) => {
      if (response.status == 200) {
        alert("Cập nhật trạng thái thông báo thành công");
        this.searchNotification();
      } else {
        alert("Cập nhật trạng thái thông báo thất bại");
      }
    });
  }

  getTimeAgo(dateTime: string): string {
    const now = new Date();
    const diff = now.getTime() - new Date(dateTime).getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? 'Hôm qua' : `${days} ngày trước`;
    } else if (hours > 0) {
      return hours === 1 ? '1 giờ trước' : `${hours} giờ trước`;
    } else if (minutes > 0) {
      return minutes === 1 ? '1 phút trước' : `${minutes} phút trước`;
    } else if (seconds > 0) {
      return seconds === 1 ? 'Vừa xong' : `${seconds} giây trước`;
    } else {
      return 'Vừa xong';
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.searchNotiByNameStatus();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchNotiByNameStatus();
    }
  }

  prePage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchNotiByNameStatus();
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
