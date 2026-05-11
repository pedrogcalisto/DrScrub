import { NgClass } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { SITE_CONFIG } from '../../config/site.config';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NgClass],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  animations: [
    trigger('heroEnter', [
      transition(':enter', [
        query(
          '.hero__eyebrow, .hero__title, .hero__lede, .hero__actions, .hero__stats',
          [
            style({ opacity: 0, transform: 'translateY(28px)' }),
            stagger(80, [
              animate(
                '720ms cubic-bezier(0.22, 1, 0.36, 1)',
                style({ opacity: 1, transform: 'translateY(0)' }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
    trigger('cardStagger', [
      transition(':enter', [
        query(
          '.card',
          [
            style({ opacity: 0, transform: 'translateY(36px) scale(0.98)' }),
            stagger(110, [
              animate(
                '780ms cubic-bezier(0.22, 1, 0.36, 1)',
                style({ opacity: 1, transform: 'translateY(0) scale(1)' }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
    trigger('marqueeEnter', [
      transition(':enter', [
        query(
          '.marquee__item',
          [
            style({ opacity: 0, transform: 'translateY(12px)' }),
            stagger(40, [
              animate(
                '520ms cubic-bezier(0.22, 1, 0.36, 1)',
                style({ opacity: 1, transform: 'translateY(0)' }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
    trigger('footerRise', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(32px)' }),
        animate('800ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class LandingPageComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly site = SITE_CONFIG;
  readonly year = new Date().getFullYear();
  readonly marqueeItems = [...SITE_CONFIG.clients, ...SITE_CONFIG.clients];

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);

  readonly comparePosition = signal(52);
  private readonly compareDragging = signal(false);
  private readonly compareRoot = viewChild<ElementRef<HTMLElement>>('compareRoot');

  private readonly heroMedia = viewChild<ElementRef<HTMLElement>>('heroMedia');

  readonly showMakeVideo = computed(() => !!SITE_CONFIG.media.videoMake?.trim());
  readonly showDoneVideo = computed(() => !!SITE_CONFIG.media.videoDone?.trim());
  readonly hasLocalVideos = computed(() => this.showMakeVideo() || this.showDoneVideo());

  readonly makeVideoReady = signal(false);
  readonly doneVideoReady = signal(false);

  /** Squeegee wipe overlay when using “Back to top”. */
  readonly backToTopFx = signal(false);
  private backToTopFxTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    afterNextRender(() => {
      this.initScrollReveals(this.host.nativeElement);
      this.applyHeroParallax();
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 24);
    this.applyHeroParallax();
  }

  @HostListener('window:pointerup')
  @HostListener('window:pointercancel')
  onComparePointerUp(): void {
    this.compareDragging.set(false);
  }

  @HostListener('window:pointermove', ['$event'])
  onComparePointerMove(event: PointerEvent): void {
    if (!this.compareDragging()) return;
    event.preventDefault();
    this.updateCompareFromClientX(event.clientX);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onComparePointerDown(event: PointerEvent): void {
    event.preventDefault();
    const host = event.currentTarget as HTMLElement;
    host.setPointerCapture(event.pointerId);
    this.compareDragging.set(true);
    this.updateCompareFromClientX(event.clientX);
  }

  onMakeVideoLoaded(): void {
    this.makeVideoReady.set(true);
  }

  onDoneVideoLoaded(): void {
    this.doneVideoReady.set(true);
  }

  /** Keeps videos silent even if the user tries to unmute via native controls. */
  lockVideoMuted(event: Event): void {
    const v = event.target;
    if (!(v instanceof HTMLVideoElement)) return;
    queueMicrotask(() => {
      v.muted = true;
      v.volume = 0;
      v.defaultMuted = true;
    });
  }

  onBackToTop(event: Event): void {
    event.preventDefault();
    const target = document.getElementById('top');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      target?.scrollIntoView({ block: 'start' });
      history.replaceState(null, '', '#top');
      return;
    }

    this.backToTopFx.set(true);
    if (this.backToTopFxTimer !== undefined) {
      window.clearTimeout(this.backToTopFxTimer);
    }

    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#top');

    this.backToTopFxTimer = window.setTimeout(() => {
      this.backToTopFx.set(false);
      this.backToTopFxTimer = undefined;
    }, 1250);
  }

  private updateCompareFromClientX(clientX: number): void {
    const root = this.compareRoot()?.nativeElement;
    if (!root) return;
    const media = root.querySelector('.compare__media') as HTMLElement | null;
    const rect = (media ?? root).getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    this.comparePosition.set(Math.round((x / rect.width) * 100));
  }

  private applyHeroParallax(): void {
    const node = this.heroMedia()?.nativeElement;
    if (!node) return;
    const y = window.scrollY;
    node.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.05)`;
  }

  private initScrollReveals(root: HTMLElement): void {
    const nodes = root.querySelectorAll<HTMLElement>('[data-reveal]');
    const cleanups: Array<() => void> = [];

    nodes.forEach((el) => {
      const delay = Number(el.dataset['revealDelay'] ?? 0);
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          window.setTimeout(() => el.classList.add('is-revealed'), delay);
          observer.disconnect();
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );
      observer.observe(el);
      cleanups.push(() => observer.disconnect());
    });

    this.destroyRef.onDestroy(() => cleanups.forEach((fn) => fn()));
  }
}
