import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { ThemeService } from '../../../theme/theme.service';
import { AuthService } from '../../service/auth.service';

import { ReportFormComponent } from '../report-form/report-form.component';
import { MyReportComponent } from '../my-report/my-report.component';
import { NotificationComponent } from '../notification/notification.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {

  // Mobile menu state
  menuOpen = false;

  // Theme
  isDarkTheme = false;

  // Auth
  isAuthenticated = false;

  constructor(
    private themeService: ThemeService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  /* =========================
     MENU (MOBILE)
  ========================== */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /* =========================
     PROFILE
  ========================== */
  onProfile(): void {
    this.dialog.open(ProfileComponent, {
      width: '400px'
    });
  }

  /* =========================
     REPORTS
  ========================== */
  openReportDialog(): void {
    this.dialog.open(ReportFormComponent, {
      width: '300px'
    });
  }

  openReport(): void {
    this.dialog.open(MyReportComponent, {
      width: '900px',
      height: '500px',
      panelClass: 'animated-dialog'
    });
  }

  /* =========================
     NOTIFICATIONS
  ========================== */
  openNotification(): void {
    this.dialog.open(NotificationComponent, {
      panelClass: 'animated-dialog'
    });
  }

  /* =========================
     THEME
  ========================== */
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeService.enableDarkTheme(this.isDarkTheme);
  }

  /* =========================
     NAVIGATION
  ========================== */
  goBack(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/homepage']);
    } else {
      this.router.navigate(['/map-display']);
    }
  }

  /* =========================
     LOGOUT
  ========================== */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('anonymousUser');

    this.toastr.success('Logout successful', 'Success', {
      positionClass: 'toast-top-right',
      progressBar: true,
      timeOut: 1500
    });

    setTimeout(() => {
      this.router.navigate(['/user-home']);
    }, 1500);
  }
}

























// import { Component, OnInit } from '@angular/core';
// import { ThemeService } from '../../../theme/theme.service';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { ReportFormComponent } from '../report-form/report-form.component';
// import { ToastrService } from 'ngx-toastr';
// import { Router } from '@angular/router';
// import { AuthService } from '../../service/auth.service';
// import { ProfileComponent } from '../profile/profile.component';
// import { MyReportComponent } from '../my-report/my-report.component';
// import { NotificationComponent } from '../notification/notification.component';

// @Component({
//   selector: 'app-user-header',
//   standalone: false,
//   templateUrl: './user-header.component.html',
//   styleUrl: './user-header.component.scss'
// })
// export class UserHeaderComponent implements OnInit{
//   isDarkTheme = false;
//   isAuthenticated = false;
//   isAnonymous: boolean = false;

//   constructor(
//     private themeService: ThemeService,
//     public dialog: MatDialog,
//     private toastr: ToastrService,
//     private router: Router,
//     private authService: AuthService,

//   ) {}

//   openReportDialog(): void {
//     const dialogRef = this.dialog.open(ReportFormComponent, {
//       width: '300px'
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//     });
//   }

//   openReport(): void {
//     const dialogRef = this.dialog.open(MyReportComponent, {
//       width: '900px',
//       height: '500px',
//       panelClass: 'animated-dialog',
//       data: {}
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('Anonymous report closed')
//     });
//   }

//   openNotification(): void {
//     const dialogRef = this.dialog.open(NotificationComponent, {
//       panelClass: 'animated-dialog',
//       data: {}
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('Anonymous report closed')
//     });
//   }

//   toggleTheme(): void {
//     this.isDarkTheme = !this.isDarkTheme;
//     this.themeService.enableDarkTheme(this.isDarkTheme);
//   }

//   onProfile() {
//     const dialogRef = this.dialog.open(ProfileComponent, {
//       width: '400px',
//       disableClose: false
//     })
//   }

//   onYourReport() {
//     console.log('Your Report clicked');
//     // Navigate to "Your Report" page
//   }

//   showReportForm(): void {
//     this.showReportForm();
//   }

//   ngOnInit() {
//     this.isAuthenticated = this.authService.isLoggedIn();
//   }

//   onLogout() {
//     localStorage.removeItem('anonymousUser');
//     this.toastr.success('Logout successfuly', 'Success', {
//       positionClass: 'toast-top-right'
//     });
//     this.router.navigate(['/user-home']);
//   }

//   closeReportForm() {

//   }

//   onRegister() {

//   }

//   goBack() {
//     const token = localStorage.getItem('token');

//     if (token) {
//       this.router.navigate(['/homepage']);
//     } else {
//       this.router.navigate(['/map-display']);
//     }
//   }

//   OnLogout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     this.toastr.success('Logout success', 'Success', {
//       positionClass: 'toast-top-right',
//       progressBar: true,
//       timeOut: 1500
//     });

//     setTimeout(() => {
//     this.router.navigate(['/user-home']);
//   }, 1500);
//   }
// }
