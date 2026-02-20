import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ViewHistoryComponent } from '../view-history/view-history.component';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '../../../theme/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit, OnDestroy {
  showPopup = false;
  menuOpen = false;
  showHistoryPopup = false;
  isDarkTheme = false;
  private themeSubscription: Subscription = new Subscription();

  // ===== Language Switcher =====
  currentLanguage = 'en';

  @ViewChild('chatbotContainer') chatbotContainer!: ElementRef;

  constructor(
    private router: Router,
    private authservice: AuthService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkTheme$.subscribe(
      (isDark) => (this.isDarkTheme = isDark)
    );

    // ===== Safe localStorage access =====
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedLang = localStorage.getItem('selectedLanguage');
      if (savedLang) this.currentLanguage = savedLang;
    }

    // Load Google Translate
    this.loadGoogleTranslate();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  // ===================== Theme & Popup =====================
  toggleTheme(): void { this.themeService.toggleTheme(); }
  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  openPopup(): void { this.showPopup = true; }
  closePopup(): void { this.showPopup = false; }
  navigateToCreateAccount(): void { this.router.navigate(['/register']); }
  navigateToLogin(): void { this.router.navigate(['/login']); }

  continueAsAnonymous(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      let sessionID = localStorage.getItem('session_id');
      if (!sessionID) this.authservice.generateSessionId();
    }
    this.router.navigate(['/map-display']);
  }

  openReportHistoryDialog(): void {
    this.dialog.open(ViewHistoryComponent, { width: '1200px', height: '500px' });
  }

  openChat(): void {
    if (this.chatbotContainer) {
      this.chatbotContainer.nativeElement.style.display = 'block';
      if ((window as any).eapps) (window as any).eapps.init();
    }
  }

  // ===================== Language Switcher =====================
  changeLanguage(lang: string): void {
    this.currentLanguage = lang;

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selectedLanguage', lang);
    }

    // Trigger Google Translate invisibly
    const googleSelect: any = document.querySelector('.goog-te-combo');
    if (googleSelect) {
      googleSelect.value = lang === 'sw' ? 'sw' : 'en';
      googleSelect.dispatchEvent(new Event('change'));
    }

    this.hideGoogleTranslateUI();
  }

  // ===================== Google Translate Loader =====================
  loadGoogleTranslate(): void {
    if (typeof window === 'undefined') return;

    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,sw', autoDisplay: false },
          'google_translate_element'
        );

        setTimeout(() => this.hideGoogleTranslateUI(), 500);
      };

      const script = this.renderer.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      this.renderer.appendChild(document.body, script);
    }

    // Ensure UI stays hidden if injected later
    const observer = new MutationObserver(() => this.hideGoogleTranslateUI());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  hideGoogleTranslateUI(): void {
    const styles = `
      .goog-te-banner-frame, .goog-te-menu-frame, .goog-te-balloon-frame,
      .goog-te-gadget, .goog-te-menu-value, .goog-logo-link,
      .goog-te-gadget-simple, .VIpgJd-ZVi9od-ORHb-OEVmcd {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      body { top: 0 !important; }
    `;

    let styleTag = document.getElementById('hide-google-style') as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'hide-google-style';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = styles;
  }
}
