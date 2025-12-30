import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Fade in from bottom animation
export const useFadeInUp = <T extends HTMLElement>(
    delay: number = 0,
    duration: number = 0.8
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(
                ref.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    delay,
                    ease: 'power3.out',
                }
            );
        }
    }, [delay, duration]);

    return ref;
};

// Fade in from left animation
export const useFadeInLeft = <T extends HTMLElement>(
    delay: number = 0,
    duration: number = 0.8
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(
                ref.current,
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration,
                    delay,
                    ease: 'power3.out',
                }
            );
        }
    }, [delay, duration]);

    return ref;
};

// Fade in from right animation
export const useFadeInRight = <T extends HTMLElement>(
    delay: number = 0,
    duration: number = 0.8
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(
                ref.current,
                { opacity: 0, x: 50 },
                {
                    opacity: 1,
                    x: 0,
                    duration,
                    delay,
                    ease: 'power3.out',
                }
            );
        }
    }, [delay, duration]);

    return ref;
};

// Scale in animation
export const useScaleIn = <T extends HTMLElement>(
    delay: number = 0,
    duration: number = 0.6
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(
                ref.current,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration,
                    delay,
                    ease: 'back.out(1.7)',
                }
            );
        }
    }, [delay, duration]);

    return ref;
};

// Scroll-triggered fade in
export const useScrollFadeIn = <T extends HTMLElement>(
    direction: 'up' | 'down' | 'left' | 'right' = 'up',
    duration: number = 0.8,
    distance: number = 50
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (ref.current) {
            const getInitialProps = () => {
                switch (direction) {
                    case 'up':
                        return { y: distance };
                    case 'down':
                        return { y: -distance };
                    case 'left':
                        return { x: distance };
                    case 'right':
                        return { x: -distance };
                }
            };

            gsap.fromTo(
                ref.current,
                { opacity: 0, ...getInitialProps() },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration,
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                    ease: 'power3.out',
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [direction, duration, distance]);

    return ref;
};

// Stagger children animation on scroll
export const useStaggerChildren = <T extends HTMLElement>(
    childSelector: string,
    staggerDelay: number = 0.1,
    duration: number = 0.6
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (ref.current) {
            const children = ref.current.querySelectorAll(childSelector);

            gsap.fromTo(
                children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    stagger: staggerDelay,
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                    ease: 'power3.out',
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [childSelector, staggerDelay, duration]);

    return ref;
};

// Counter animation for stats
export const animateCounter = (
    element: HTMLElement,
    endValue: number,
    duration: number = 2,
    suffix: string = ''
) => {
    const obj = { value: 0 };
    gsap.to(obj, {
        value: endValue,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        onUpdate: () => {
            element.textContent = Math.round(obj.value) + suffix;
        },
    });
};

export { gsap, ScrollTrigger };
