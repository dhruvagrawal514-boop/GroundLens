import { animate, scroll, inView, stagger } from 'motion';

// Global Easing for Framer Motion emulation
const appleEase = [0.16, 1, 0.3, 1];

export function initHomeAnimations() {
    animate('.hero-word',
        { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)'] },
        { delay: stagger(0.05), ease: appleEase, duration: 0.8 }
    );

    document.querySelectorAll('.motion-section').forEach(section => {
        inView(section, () => {
            animate(section,
                { opacity: 1, y: 0, filter: 'blur(0px)' },
                { duration: 0.8, ease: appleEase }
            );
        }, { margin: "-100px 0px" });
    });

    const heroTitle = document.querySelector('.hero-title');
    const heroSection = document.querySelector('.hero-section');
    if (heroTitle && heroSection) {
        scroll(animate(heroTitle, { y: [0, -200] }), {
            target: heroSection,
            offset: ['start start', 'end start']
        });
    }

    const heroCard = document.querySelector('.hero-glass-map-card');
    if (heroCard && heroSection) {
        scroll(animate(heroCard, { scale: [1, 0.9], opacity: [1, 0] }), {
            target: heroSection,
            offset: ['start start', 'end start']
        });
    }

    document.querySelectorAll('.features-grid').forEach(grid => {
        inView(grid, () => {
            const cards = grid.querySelectorAll('.glass-card');
            if (cards.length > 0) {
                animate(cards,
                    { opacity: [0, 1], y: [40, 0] },
                    { delay: stagger(0.1), duration: 0.8, ease: appleEase }
                );
            }
        }, { margin: "-100px 0px" });
    });

    const stepCards = document.querySelectorAll('.step-card');
    const uis = [
        document.getElementById('iphone-ui-1'),
        document.getElementById('iphone-ui-2'),
        document.getElementById('iphone-ui-3'),
        document.getElementById('iphone-ui-4')
    ];

    stepCards.forEach((card, index) => {
        inView(card, () => {
            uis.forEach(ui => { if (ui) { ui.style.opacity = '0'; } });
            if (uis[index]) {
                uis[index].style.opacity = '1';
                animate(uis[index], { scale: [1.1, 1] }, { duration: 0.8, ease: appleEase });
            }
        }, { margin: "-40% 0px -40% 0px" });
    });
}
