
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AnimationOptions = {
  delay?: number;
  duration?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  timing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  iterations?: number | 'infinite';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
};

export function createAnimation(
  keyframes: string,
  options: AnimationOptions = {}
): string {
  const {
    delay = 0,
    duration = 300,
    direction = 'normal',
    timing = 'ease-out',
    iterations = 1,
    fillMode = 'forwards',
  } = options;

  return `${keyframes} ${duration}ms ${timing} ${delay}ms ${iterations} ${direction} ${fillMode}`;
}

export const fadeIn = (options?: AnimationOptions) =>
  createAnimation('fade-in', options);

export const fadeOut = (options?: AnimationOptions) =>
  createAnimation('fade-out', options);

export const slideInRight = (options?: AnimationOptions) =>
  createAnimation('slide-in-right', options);

export const slideOutRight = (options?: AnimationOptions) =>
  createAnimation('slide-out-right', options);

export const slideInLeft = (options?: AnimationOptions) =>
  createAnimation('slide-in-left', options);

export const slideOutLeft = (options?: AnimationOptions) =>
  createAnimation('slide-out-left', options);

export const slideInUp = (options?: AnimationOptions) =>
  createAnimation('slide-in-up', options);

export const slideOutUp = (options?: AnimationOptions) =>
  createAnimation('slide-out-up', options);

export const slideInDown = (options?: AnimationOptions) =>
  createAnimation('slide-in-down', options);

export const slideOutDown = (options?: AnimationOptions) =>
  createAnimation('slide-out-down', options);

export const scaleIn = (options?: AnimationOptions) =>
  createAnimation('scale-in', options);

export const scaleOut = (options?: AnimationOptions) =>
  createAnimation('scale-out', options);

export const applyAnimation = (element: HTMLElement, animation: string) => {
  element.style.animation = animation;
  return new Promise<void>((resolve) => {
    const handleAnimationEnd = () => {
      element.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    };
    element.addEventListener('animationend', handleAnimationEnd);
  });
};
