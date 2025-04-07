document.addEventListener("DOMContentLoaded", function () {
    const rotateBtn = document.querySelector('.rotate-btn');
    const closeBtn = document.querySelector('.close-btn');
    const pageFlips = document.querySelectorAll('.page-flip');
    const pageFlipsArray = Array.from(pageFlips).reverse(); // Inverser l'ordre pour affichage correct
    let currentPageIndex = -1; // Aucune page ouverte au départ

    const zIndexTimeouts = new Map(); // Pour suivre les timeouts actifs

    // Initialisation : chaque page commence avec un z-index négatif basé sur son index
    pageFlipsArray.forEach((page, i) => {
        page.style.zIndex = -i;
    });

    // Ouvrir une page
    function openPage(pageIndex) {
        const pageToOpen = pageFlipsArray[pageIndex];

        // Annule un éventuel timeout actif
        if (zIndexTimeouts.has(pageToOpen)) {
            clearTimeout(zIndexTimeouts.get(pageToOpen));
            zIndexTimeouts.delete(pageToOpen);
        }

        // Remet le z-index à une valeur positive
        pageToOpen.style.zIndex = pageIndex + 1;

        // Ne rien faire si déjà ouverte
        if (pageToOpen.classList.contains('flipped')) return;

        pageToOpen.classList.add('flipped');
        currentPageIndex = pageIndex;
    }

    // Fermer la dernière page ouverte
    function closeLastOpenedPage() {
        if (currentPageIndex === -1) return;

        const pageToClose = pageFlipsArray[currentPageIndex];

        // Annule un timeout précédent si présent
        if (zIndexTimeouts.has(pageToClose)) {
            clearTimeout(zIndexTimeouts.get(pageToClose));
            zIndexTimeouts.delete(pageToClose);
        }

        // Enlève la classe pour lancer l’animation
        pageToClose.classList.remove('flipped');

        // Après l’animation (1s), remettre un z-index négatif
        const timeoutId = setTimeout(() => {
            pageToClose.style.zIndex = -currentPageIndex;
            zIndexTimeouts.delete(pageToClose);
        }, 1000);

        zIndexTimeouts.set(pageToClose, timeoutId);

        // Mettre à jour l’index
        currentPageIndex = currentPageIndex > 0 ? currentPageIndex - 1 : -1;
    }

    // Clique sur "faire tourner"
    rotateBtn.addEventListener('click', function () {
        if (currentPageIndex < pageFlipsArray.length - 1) {
            openPage(currentPageIndex + 1);
        }
    });

    // Clique sur "fermer"
    closeBtn.addEventListener('click', function () {
        closeLastOpenedPage();
    });
});
