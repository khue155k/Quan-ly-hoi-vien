import { INavData } from "@coreui/angular";

export const navItems: INavData[] = [
    {
        name: 'Dashboard',
        url: '/home/dashboard',
        iconComponent: { name: 'cil-speedometer' },
    },
    {
        name: 'Danh sách thành viên',
        url: '/home/companies',
        iconComponent: { name: 'cil-people' }
    },
    {
        name: 'Hội phí',
        url: '/home/membership-fee',
        iconComponent: { name: 'cil-Dollar' }
    },
    {
        name: 'Thông báo',
        url: '/home/notification',
        iconComponent: { name: 'cilBell' }
    },
    {
        name: 'Đổi mật khẩu',
        url: '/home/change-password',
        iconComponent: { name: 'cilLockLocked' }
    },
]; 
export const navItemsLogout: INavData[] = [
    {
        name: 'Đăng xuất',
        url: '#',
        iconComponent: { name: 'cil-account-logout' },
    },
]; 