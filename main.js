document.addEventListener("DOMContentLoaded", function () {
    const rotateBtn = document.querySelector(".rotate-btn");
    const closeBtn = document.querySelector(".close-btn");
    const controls = document.querySelector(".controls");
    const root = document.documentElement;
    const pageFlips = document.querySelectorAll(".page-flip");
    const pageFlipsArray = Array.from(pageFlips).reverse();
    let currentPageIndex = -1;

    const zIndexTimeouts = new Map();
    const baseBookWidth = 680;
    const baseBookHeight = 400;
    const basePageWidth = 285;
    const basePageHeight = 388;
    const maxScale = 2.5;

    function updateBookScale() {
        const viewportWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const compactScreen = viewportWidth < 700;
        const horizontalPadding = compactScreen ? 12 : 64;
        const controlsHeight = controls ? controls.offsetHeight : 56;
        const layoutGap = viewportHeight < 700 ? 12 : 24;
        const verticalChrome = compactScreen ? 16 : 40;
        const availableWidth = Math.max(180, viewportWidth - horizontalPadding);
        const availableHeight = Math.max(180, viewportHeight - controlsHeight - layoutGap - verticalChrome);
        const widthReference = baseBookWidth;
        const heightReference = baseBookHeight;
        const scaleFromWidth = availableWidth / widthReference;
        const scaleFromHeight = availableHeight / heightReference;
        const nextScale = Math.max(0.18, Math.min(maxScale, scaleFromWidth, scaleFromHeight));

        root.style.setProperty("--scale-factor", nextScale.toFixed(3));
        root.style.setProperty("--book-offset-x", "0px");
        root.style.setProperty("--book-offset-y", "0px");

        if (pageFlipsArray.length > 0) {
            const firstPageFlip = pageFlipsArray[0];
            const firstPageFlipRect = firstPageFlip.getBoundingClientRect();
            const flipStyles = window.getComputedStyle(firstPageFlip);
            const visibleStartX = firstPageFlipRect.left + (parseFloat(flipStyles.paddingLeft) * nextScale);
            const offsetX = (viewportWidth / 2) - visibleStartX;
            root.style.setProperty("--book-offset-x", `${offsetX.toFixed(2)}px`);
        }
    }

    pageFlipsArray.forEach((page, i) => {
        page.style.zIndex = -i;
    });

    updateBookScale();
    window.addEventListener("resize", updateBookScale);
    window.addEventListener("orientationchange", updateBookScale);
    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", updateBookScale);
    }

    function openPage(pageIndex) {
        const pageToOpen = pageFlipsArray[pageIndex];

        if (zIndexTimeouts.has(pageToOpen)) {
            clearTimeout(zIndexTimeouts.get(pageToOpen));
            zIndexTimeouts.delete(pageToOpen);
        }

        pageToOpen.style.zIndex = pageIndex + 1;

        if (pageToOpen.classList.contains("flipped")) return;

        pageToOpen.classList.add("flipped");
        currentPageIndex = pageIndex;
    }

    function closeLastOpenedPage() {
        if (currentPageIndex === -1) return;

        const pageToClose = pageFlipsArray[currentPageIndex];
        const closedPageIndex = currentPageIndex;

        if (zIndexTimeouts.has(pageToClose)) {
            clearTimeout(zIndexTimeouts.get(pageToClose));
            zIndexTimeouts.delete(pageToClose);
        }

        pageToClose.classList.remove("flipped");

        const timeoutId = setTimeout(() => {
            pageToClose.style.zIndex = -closedPageIndex;
            zIndexTimeouts.delete(pageToClose);
        }, 1000);

        zIndexTimeouts.set(pageToClose, timeoutId);
        currentPageIndex = currentPageIndex > 0 ? currentPageIndex - 1 : -1;
    }

    rotateBtn.addEventListener("click", function () {
        if (currentPageIndex < pageFlipsArray.length - 1) {
            openPage(currentPageIndex + 1);
        }
    });

    closeBtn.addEventListener("click", function () {
        closeLastOpenedPage();
    });
});
