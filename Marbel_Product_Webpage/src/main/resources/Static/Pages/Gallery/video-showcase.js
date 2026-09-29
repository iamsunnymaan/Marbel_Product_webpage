// Play showcase videos only while visible; show a placeholder if a file fails to load.
document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.video-box');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target.querySelector('video');
            if (!video || entry.target.classList.contains('video-failed')) return;
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.25 });

    boxes.forEach((box) => {
        const video = box.querySelector('video');
        const source = video && video.querySelector('source');
        const fail = () => box.classList.add('video-failed');
        if (video) video.addEventListener('error', fail);
        if (source) source.addEventListener('error', fail);
        observer.observe(box);
    });
});
