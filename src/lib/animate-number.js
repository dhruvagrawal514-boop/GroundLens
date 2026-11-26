/** Animates a number counting up to its target value. */
export function animateNumber(element, target, duration = 1000, prefix = '', suffix = '') {
    if (!element) return;
    const start = 0;
    const change = target - start;
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (change * easeProgress));
        const formattedValue = currentValue.toLocaleString();
        element.innerText = `${prefix}${formattedValue}${suffix}`;
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.innerText = `${prefix}${target.toLocaleString()}${suffix}`;
        }
    }
    requestAnimationFrame(updateNumber);
}
