import { Injectable, ElementRef } from '@angular/core';

/**
 * Service to handle "fly-to-compare" microinteraction animations.
 * 
 * When a user clicks a compare icon, this service creates a visual clone
 * that animates along a curved path from the source element to the target
 * element (compare button in header).
 * 
 * @example
 * ```typescript
 * // In component
 * constructor(private flyToCompare: FlyToCompareService) {}
 * 
 * onCompareClick(event: Event, university: University): void {
 *   const sourceElement = event.currentTarget as HTMLElement;
 *   const targetElement = this.compareButtonRef.nativeElement;
 *   
 *   this.flyToCompare.animate(sourceElement, targetElement)
 *     .then(() => {
 *       // Add to compare list after animation completes
 *       this.compareService.addToCompare(university);
 *     });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class FlyToCompareService {
  /**
   * Duration of the animation in milliseconds
   */
  private readonly ANIMATION_DURATION = 600;

  /**
   * CSS class applied to the cloned element during animation
   */
  private readonly CLONE_CLASS = 'fly-to-compare-clone';

  /**
   * Easing function for smooth, natural animation (ease-out)
   */
  private readonly EASING_FUNCTION = 'cubic-bezier(0.4, 0, 0.2, 1)';

  /**
   * Animates a visual clone from source element to target element.
   * 
   * The animation:
   * 1. Creates a clone of the source element
   * 2. Positions it at the source location
   * 3. Animates it along a curved path to the target
   * 4. Scales down and fades during animation
   * 5. Removes the clone when complete
   * 
   * @param sourceElement - The element where animation starts (compare icon button)
   * @param targetElement - The target element (compare button in header). 
   *                        Can be HTMLElement, ElementRef, or CSS selector string
   * @returns Promise that resolves when animation completes
   */
  animate(
    sourceElement: HTMLElement,
    targetElement: HTMLElement | ElementRef<HTMLElement> | string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Get target element (handle ElementRef, HTMLElement, or selector string)
        const target = this.getTargetElement(targetElement);
        if (!target) {
          console.warn('[FlyToCompare] Target element not found');
          reject(new Error('Target element not found'));
          return;
        }

        // Get current positions (using getBoundingClientRect for accurate positioning)
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        // Create and position clone
        const clone = this.createClone(sourceElement);
        document.body.appendChild(clone);

        // Calculate start and end positions (center points)
        const startX = sourceRect.left + sourceRect.width / 2;
        const startY = sourceRect.top + sourceRect.height / 2;
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top + targetRect.height / 2;

        // Calculate control points for curved path (cubic bezier)
        // Creates an upward curve that feels natural
        const controlPoint1X = startX;
        const controlPoint1Y = startY - Math.max(100, Math.abs(endY - startY) * 0.5);
        const controlPoint2X = endX;
        const controlPoint2Y = endY - 50;

        // Set initial position and transform
        clone.style.left = `${startX}px`;
        clone.style.top = `${startY}px`;
        clone.style.transform = 'translate(-50%, -50%) scale(1)';
        clone.style.opacity = '1';

        // Force browser reflow to ensure initial styles are applied
        clone.offsetHeight;

        // Start animation using requestAnimationFrame for smooth 60fps animation
        this.animateWithBezier(
          clone,
          { x: startX, y: startY },
          { x: endX, y: endY },
          { x: controlPoint1X, y: controlPoint1Y },
          { x: controlPoint2X, y: controlPoint2Y },
          this.ANIMATION_DURATION
        ).then(() => {
          // Clean up: remove clone from DOM
          clone.remove();
          resolve();
        }).catch((error) => {
          // Clean up on error
          clone.remove();
          reject(error);
        });
      } catch (error) {
        console.error('[FlyToCompare] Animation error:', error);
        reject(error);
      }
    });
  }

  /**
   * Resolves target element from various input types.
   * 
   * @param target - Can be HTMLElement, ElementRef, or CSS selector string
   * @returns HTMLElement or null if not found
   */
  private getTargetElement(
    target: HTMLElement | ElementRef<HTMLElement> | string
  ): HTMLElement | null {
    if (target instanceof HTMLElement) {
      return target;
    }
    
    if (target instanceof ElementRef) {
      return target.nativeElement;
    }
    
    if (typeof target === 'string') {
      // Try as CSS selector (e.g., '.compare-btn' or '#compareIcon')
      return document.querySelector(target) as HTMLElement;
    }
    
    return null;
  }

  /**
   * Creates a visual clone of the source element.
   * 
   * The clone includes:
   * - The SVG icon from the source element
   * - Appropriate styling for animation
   * - High z-index to appear above other content
   * 
   * @param sourceElement - The element to clone
   * @returns The cloned element ready for animation
   */
  private createClone(sourceElement: HTMLElement): HTMLElement {
    const clone = document.createElement('div');
    clone.className = this.CLONE_CLASS;

    // Clone the SVG icon from the source element
    const svg = sourceElement.querySelector('svg');
    if (svg) {
      const svgClone = svg.cloneNode(true) as SVGElement;
      clone.appendChild(svgClone);
    } else {
      // Fallback: create a default compare icon if no SVG found
      clone.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      `;
    }

    return clone;
  }

  /**
   * Animates an element along a cubic bezier curve path.
   * 
   * Uses requestAnimationFrame for smooth 60fps animation.
   * Implements cubic bezier interpolation for natural curved motion.
   * 
   * @param element - The element to animate
   * @param start - Starting position {x, y}
   * @param end - Ending position {x, y}
   * @param cp1 - First control point {x, y}
   * @param cp2 - Second control point {x, y}
   * @param duration - Animation duration in milliseconds
   * @returns Promise that resolves when animation completes
   */
  private animateWithBezier(
    element: HTMLElement,
    start: { x: number; y: number },
    end: { x: number; y: number },
    cp1: { x: number; y: number },
    cp2: { x: number; y: number },
    duration: number
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();

      /**
       * Animation frame callback
       * Calculates position along bezier curve and updates element transform
       */
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Apply easing function (ease-out)
        // Using cubic ease-out: 1 - (1 - t)^3 for smooth deceleration
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        // Calculate position using cubic bezier formula
        // B(t) = (1-t)^3*P0 + 3*(1-t)^2*t*P1 + 3*(1-t)*t^2*P2 + t^3*P3
        const t = easedProgress;
        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;
        const t2 = t * t;
        const t3 = t2 * t;

        const x = mt3 * start.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * end.x;
        const y = mt3 * start.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * end.y;

        // Scale down as it approaches target (from 1.0 to 0.5)
        const scale = 1 - (progress * 0.5);
        
        // Slight fade (from 1.0 to 0.7) for visual polish
        const opacity = 1 - (progress * 0.3);

        // Update element position and transform using CSS transforms
        // Using translate(-50%, -50%) to center the element on the calculated point
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.transform = `translate(-50%, -50%) scale(${scale})`;
        element.style.opacity = `${opacity}`;

        // Continue animation if not complete
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation complete
          resolve();
        }
      };

      // Start animation loop
      requestAnimationFrame(animate);
    });
  }
}
