document.addEventListener("DOMContentLoaded", function () {
    const rotateBtn = document.querySelector('.rotate-btn');
    const closeBtn = document.querySelector('.close-btn');
    const pageFlips = document.querySelectorAll('.page-flip');
    const pageFlipsArray = Array.from(pageFlips).reverse(); // Inverser l'ordre pour affichage correct
    let currentPageIndex = -1; // Aucune page ouverte au d�part

    const zIndexTimeouts = new Map(); // Pour suivre les timeouts actifs

    // Initialisation : chaque page commence avec un z-index n�gatif bas� sur son index
    pageFlipsArray.forEach((page, i) => {
        page.style.zIndex = -i;
    });

    // Ouvrir une page
    function openPage(pageIndex) {
        const pageToOpen = pageFlipsArray[pageIndex];

        // Annule un �ventuel timeout actif
        if (zIndexTimeouts.has(pageToOpen)) {
            clearTimeout(zIndexTimeouts.get(pageToOpen));
            zIndexTimeouts.delete(pageToOpen);
        }

        // Remet le z-index � une valeur positive
        pageToOpen.style.zIndex = pageIndex + 1;

        // Ne rien faire si d�j� ouverte
        if (pageToOpen.classList.contains('flipped')) return;

        pageToOpen.classList.add('flipped');
        currentPageIndex = pageIndex;
    }

    // Fermer la derni�re page ouverte
    function closeLastOpenedPage() {
        if (currentPageIndex === -1) return;

        const pageToClose = pageFlipsArray[currentPageIndex];

        // Annule un timeout pr�c�dent si pr�sent
        if (zIndexTimeouts.has(pageToClose)) {
            clearTimeout(zIndexTimeouts.get(pageToClose));
            zIndexTimeouts.delete(pageToClose);
        }

        // Enl�ve la classe pour lancer l�animation
        pageToClose.classList.remove('flipped');

        // Apr�s l�animation (1s), remettre un z-index n�gatif
        const timeoutId = setTimeout(() => {
            pageToClose.style.zIndex = -currentPageIndex;
            zIndexTimeouts.delete(pageToClose);
        }, 1000);

        zIndexTimeouts.set(pageToClose, timeoutId);

        // Mettre � jour l�index
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
