import { NgClass } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  NgZone,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import lottie, { type AnimationItem } from 'lottie-web';
import cleaningYellowHand from '../../animation/Cleaning Yellow Hand.json';
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
  private readonly ngZone = inject(NgZone);

  readonly site = SITE_CONFIG;
  readonly year = new Date().getFullYear();

  readonly mailtoQuoteHref = `mailto:${SITE_CONFIG.contact.email}?subject=${encodeURIComponent('Dr. Scrub — Quote request')}`;

  readonly telHref = `tel:${SITE_CONFIG.contact.phoneE164}`;

  readonly smsQuoteHref = `sms:${SITE_CONFIG.contact.phoneE164}&body=${encodeURIComponent(
    `Hi ${SITE_CONFIG.brand} — I'd like a quote for floor care in ${SITE_CONFIG.serviceAreaShort}.`,
  )}`;
  readonly marqueeItems = [...SITE_CONFIG.clients, ...SITE_CONFIG.clients];

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);

  readonly comparePosition = signal(52);
  private readonly compareDragging = signal(false);
  private readonly compareRoot = viewChild<ElementRef<HTMLElement>>('compareRoot');

  private readonly heroMedia = viewChild<ElementRef<HTMLElement>>('heroMedia');
  private readonly lottieBackTop = viewChild<ElementRef<HTMLElement>>('lottieBackTop');
  private readonly lottieScroll = viewChild<ElementRef<HTMLElement>>('lottieScroll');

  readonly showMakeVideo = computed(() => !!SITE_CONFIG.media.videoMake?.trim());
  readonly showDoneVideo = computed(() => !!SITE_CONFIG.media.videoDone?.trim());
  readonly hasLocalVideos = computed(() => this.showMakeVideo() || this.showDoneVideo());

  readonly makeVideoReady = signal(false);
  readonly doneVideoReady = signal(false);

  readonly backToTopFx = signal(false);
  readonly scrollLottieVisible = signal(false);
  private backToTopFxTimer: ReturnType<typeof setTimeout> | undefined;
  private lottieInstance: AnimationItem | undefined;
  private scrollHintAnim: AnimationItem | undefined;
  private scrollHintDomReady = false;
  private scrollHintHideTimer: ReturnType<typeof setTimeout> | undefined;
  private scrollHintEnsureAttempts = 0;
  private scrollHintRaf = 0;
  private scrollRafId = 0;

  constructor() {
    afterNextRender(() => {
      this.initScrollReveals(this.host.nativeElement);
      this.applyHeroParallax();
      this.warmScrollHintAfterRender();
      this.attachGlobalScrollActivityListeners();
    });
    this.destroyRef.onDestroy(() => {
      if (this.scrollRafId !== 0) {
        cancelAnimationFrame(this.scrollRafId);
      }
      if (this.scrollHintRaf !== 0) {
        cancelAnimationFrame(this.scrollHintRaf);
      }
      if (this.backToTopFxTimer !== undefined) {
        window.clearTimeout(this.backToTopFxTimer);
      }
      this.destroyLottie();
      this.destroyScrollHintLottie();
      this.detachGlobalScrollActivityListeners();
    });
  }

  private scrollActivityCleanups: Array<() => void> = [];

  private attachGlobalScrollActivityListeners(): void {
    const onTouchMove = (): void => this.scheduleScrollHintUpdate();
    const onScrollCapture = (): void => this.scheduleScrollHintUpdate();

    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('scroll', onScrollCapture, { capture: true, passive: true });

    this.scrollActivityCleanups.push(() => window.removeEventListener('touchmove', onTouchMove));
    this.scrollActivityCleanups.push(() => document.removeEventListener('scroll', onScrollCapture, true));
  }

  private detachGlobalScrollActivityListeners(): void {
    this.scrollActivityCleanups.forEach((fn) => fn());
    this.scrollActivityCleanups = [];
  }

  private scheduleScrollHintUpdate(): void {
    if (this.scrollHintRaf !== 0) return;
    this.scrollHintRaf = requestAnimationFrame(() => {
      this.scrollHintRaf = 0;
      this.ngZone.run(() => this.onUserScrollHint());
    });
  }

  private warmScrollHintAfterRender(): void {
    requestAnimationFrame(() => {
      this.ensureScrollHintLottie();
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 24);
    this.applyHeroParallax();
    this.scheduleScrollHintUpdate();
  }

  @HostListener('window:wheel')
  onWindowWheel(): void {
    this.scheduleScrollHintUpdate();
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
    event.stopPropagation();

    if (this.backToTopFxTimer !== undefined) {
      window.clearTimeout(this.backToTopFxTimer);
      this.backToTopFxTimer = undefined;
    }
    if (this.scrollRafId !== 0) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = 0;
    }
    if (this.scrollHintHideTimer !== undefined) {
      window.clearTimeout(this.scrollHintHideTimer);
      this.scrollHintHideTimer = undefined;
    }
    this.scrollLottieVisible.set(false);

    const scrollMs = 1350;
    const overlayMs = 1580;

    this.backToTopFx.set(false);
    this.destroyLottie();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.backToTopFx.set(true);
        this.playBackToTopLottie(scrollMs / 1000);
        this.smoothScrollToTop(scrollMs);
        this.backToTopFxTimer = window.setTimeout(() => {
          history.replaceState(null, '', '#top');
          this.backToTopFx.set(false);
          this.destroyLottie();
          this.backToTopFxTimer = undefined;
        }, overlayMs);
      });
    });
  }

  private playBackToTopLottie(targetDurationSec: number): void {
    const container = this.lottieBackTop()?.nativeElement;
    if (!container) return;
    this.destroyLottie();
    const anim = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: cleaningYellowHand as unknown as Record<string, unknown>,
    });
    this.lottieInstance = anim;

    const syncSpeed = (): void => {
      const naturalSec = anim.getDuration(false);
      if (naturalSec > 0) {
        anim.setSpeed(naturalSec / targetDurationSec);
        anim.goToAndPlay(0, true);
      }
    };

    anim.addEventListener('DOMLoaded', syncSpeed);
    syncSpeed();
    queueMicrotask(syncSpeed);
    requestAnimationFrame(syncSpeed);
  }

  private destroyLottie(): void {
    if (this.lottieInstance) {
      try {
        this.lottieInstance.destroy();
      } catch {}
      this.lottieInstance = undefined;
    }
    const el = this.lottieBackTop()?.nativeElement;
    if (el) {
      el.replaceChildren();
    }
  }

  private scrollRootTop(): number {
    const se = document.scrollingElement ?? document.documentElement;
    return se.scrollTop;
  }

  private smoothScrollToTop(durationMs: number): void {
    const startY = this.scrollRootTop();
    if (startY <= 0) return;

    const t0 = performance.now();
    const easeOut = (t: number): number => 1 - (1 - t) * (1 - t);
    const se = document.scrollingElement ?? document.documentElement;

    const step = (now: number): void => {
      const t = Math.min(1, (now - t0) / durationMs);
      const y = startY * (1 - easeOut(t));
      window.scrollTo(0, y);
      se.scrollTop = y;
      if (document.body) document.body.scrollTop = y;
      if (t < 1) {
        this.scrollRafId = requestAnimationFrame(step);
      } else {
        this.scrollRafId = 0;
      }
    };

    this.scrollRafId = requestAnimationFrame(step);
  }

  private onUserScrollHint(): void {
    if (this.backToTopFx()) return;

    this.ensureScrollHintLottie();
    this.playScrollHintScrub();
    this.scrollLottieVisible.set(true);

    if (this.scrollHintHideTimer !== undefined) {
      window.clearTimeout(this.scrollHintHideTimer);
    }
    this.scrollHintHideTimer = window.setTimeout(() => {
      this.scrollLottieVisible.set(false);
      const a = this.scrollHintAnim;
      if (a && this.scrollHintDomReady) {
        a.pause();
      }
      this.scrollHintHideTimer = undefined;
    }, 900);
  }

  private ensureScrollHintLottie(): void {
    if (this.scrollHintAnim) return;
    const el = this.lottieScroll()?.nativeElement;
    if (!el) {
      if (this.scrollHintEnsureAttempts < 40) {
        this.scrollHintEnsureAttempts += 1;
        requestAnimationFrame(() => this.ensureScrollHintLottie());
      }
      return;
    }
    this.scrollHintEnsureAttempts = 0;

    const anim = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: cleaningYellowHand as unknown as Record<string, unknown>,
    });
    this.scrollHintAnim = anim;

    const markReady = (): void => {
      if (!this.scrollHintAnim || anim.totalFrames <= 0) return;
      this.scrollHintDomReady = true;
      anim.pause();
      anim.goToAndStop(0, true);
    };

    anim.addEventListener('DOMLoaded', markReady);
    queueMicrotask(markReady);
    requestAnimationFrame(markReady);

    let polls = 0;
    const poll = (): void => {
      if (!this.scrollHintAnim || this.scrollHintDomReady || polls > 45) return;
      polls += 1;
      if (anim.totalFrames > 0) {
        markReady();
      } else {
        requestAnimationFrame(poll);
      }
    };
    requestAnimationFrame(poll);
  }

  private playScrollHintScrub(): void {
    const anim = this.scrollHintAnim;
    if (!anim || !this.scrollHintDomReady) return;
    const naturalSec = anim.getDuration(false);
    if (naturalSec > 0) {
      anim.setSpeed(0.72);
    }
    anim.play();
  }

  private destroyScrollHintLottie(): void {
    if (this.scrollHintHideTimer !== undefined) {
      window.clearTimeout(this.scrollHintHideTimer);
      this.scrollHintHideTimer = undefined;
    }
    if (this.scrollHintAnim) {
      try {
        this.scrollHintAnim.destroy();
      } catch {}
      this.scrollHintAnim = undefined;
    }
    this.scrollHintDomReady = false;
    const el = this.lottieScroll()?.nativeElement;
    if (el) {
      el.replaceChildren();
    }
    this.scrollLottieVisible.set(false);
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
