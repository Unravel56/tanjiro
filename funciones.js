// Datos de ejemplo para la lista de animes seguidos YA NO SON NECESARIOS AQUÍ
// const followedAnimesDataSource = [ ... ]; // Eliminado

class AnimeStreamApp {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.initAnimations();
        // this.initProfilePageFollowedList(); // Ya no se llama desde aquí
    }

    initElements() {
        this.elements = {
            mainHeader: document.getElementById("mainHeader"),
            desktopSearchBtn: document.getElementById('desktopSearchBtn'),
            desktopSearchInputContainer: document.getElementById('desktopSearchInputContainer'),
            mobileMenuBtn: document.getElementById("mobileMenuBtn"),
            closeMobileMenu: document.getElementById("closeMobileMenu"),
            mobileMenu: document.getElementById("mobileMenu"),
            mobileSearchBtn: document.getElementById("mobileSearchBtn"),
            closeMobileSearch: document.getElementById("closeMobileSearch"),
            mobileSearchPanel: document.getElementById("mobileSearch"),
            episodeSearchInput: document.getElementById('episodeSearchInput'),
        };
    }

    bindEvents() {
        const { 
            mainHeader, desktopSearchBtn, desktopSearchInputContainer,
            mobileMenuBtn, closeMobileMenu, mobileMenu, 
            mobileSearchBtn, closeMobileSearch, mobileSearchPanel,
            episodeSearchInput 
        } = this.elements;

        if (mainHeader) {
            const SCROLL_OFFSET = 50;
            window.addEventListener('scroll', () => {
                if (window.scrollY > SCROLL_OFFSET) {
                    mainHeader.classList.add('header-scrolled');
                } else {
                    mainHeader.classList.remove('header-scrolled');
                }
            });
        }

        if(desktopSearchBtn && desktopSearchInputContainer) {
            desktopSearchBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                desktopSearchInputContainer.classList.toggle('hidden');
                const input = desktopSearchInputContainer.querySelector('input');
                if(input && !desktopSearchInputContainer.classList.contains('hidden')) {
                    input.focus();
                }
            });
            document.addEventListener('click', (event) => {
                if (desktopSearchInputContainer && !desktopSearchInputContainer.classList.contains('hidden') && 
                    !desktopSearchInputContainer.contains(event.target) && 
                    event.target !== desktopSearchBtn && (desktopSearchBtn && !desktopSearchBtn.contains(event.target))) {
                    desktopSearchInputContainer.classList.add('hidden');
                }
            });
        }

        mobileMenuBtn?.addEventListener("click", (e) => this.handleMenuToggle(e, true));
        closeMobileMenu?.addEventListener("click", (e) => this.handleMenuToggle(e, false));
        mobileSearchBtn?.addEventListener("click", (e) => this.handleSearchToggle(e, true));
        closeMobileSearch?.addEventListener("click", (e) => this.handleSearchToggle(e, false));
        
        mobileMenu?.addEventListener("click", (e) => { if (e.target === mobileMenu) this.closeAllPanels(); });
        mobileSearchPanel?.addEventListener("click", (e) => { if (e.target === mobileSearchPanel) this.closeAllPanels(); });
        
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.closeAllPanels(); });

        if (episodeSearchInput) {
            episodeSearchInput.addEventListener('input', () => {
                const filter = episodeSearchInput.value.toLowerCase().trim();
                const episodeCardsContainer = document.getElementById('episodesListContainer');
                if (!episodeCardsContainer) return;

                const episodeCards = episodeCardsContainer.querySelectorAll('.episode-card');
                
                episodeCards.forEach(card => {
                    const titleElement = card.querySelector('h3.episode-title');
                    const episodeNumberElement = card.querySelector('p.episode-number-text');
                    
                    const title = titleElement ? titleElement.textContent.toLowerCase() : "";
                    const episodeText = episodeNumberElement ? episodeNumberElement.textContent.toLowerCase() : "";
                    
                    const episodeNumberMatch = episodeText.match(/\d+/);
                    const episodeNumber = episodeNumberMatch ? episodeNumberMatch[0] : "";

                    const isVisible = title.includes(filter) || 
                                      episodeText.includes(filter) || 
                                      (filter.match(/^\d+$/) && episodeNumber === filter);
                    
                    card.style.display = isVisible ? "flex" : "none";
                });
            });
        }
    }

    handleMenuToggle(e, open) {
        e.preventDefault();
        e.stopPropagation();
        if (open) {
            this.elements.mobileSearchPanel?.classList.remove("active");
            this.elements.mobileMenu?.classList.add("active");
            document.body.style.overflow = 'hidden';
        } else {
            this.elements.mobileMenu?.classList.remove("active");
            document.body.style.overflow = '';
        }
    }

    handleSearchToggle(e, open) {
        e.preventDefault();
        e.stopPropagation();
        if (open) {
            this.elements.mobileMenu?.classList.remove("active");
            this.elements.mobileSearchPanel?.classList.add("active");
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                this.elements.mobileSearchPanel?.querySelector('input[type="text"]')?.focus();
            }, 300);
        } else {
            this.elements.mobileSearchPanel?.classList.remove("active");
            document.body.style.overflow = '';
        }
    }

    closeAllPanels() {
        this.elements.mobileMenu?.classList.remove("active");
        this.elements.mobileSearchPanel?.classList.remove("active");
        document.body.style.overflow = '';
    }

    initAnimations() {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        this.animationObserver = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-in');
                    observerInstance.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar todos los elementos con 'animate-on-scroll' presentes en el DOM al cargar
        // Incluirá la tarjeta estática si tiene la clase.
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            if (this.animationObserver) {
                this.animationObserver.observe(element);
            }
        });
    }

    // --- Métodos para la Página de Perfil ELIMINADOS ---
    // initProfilePageFollowedList() { ... }
    // renderFollowedAnime() { ... }
    // bindUnfollowButtons() { ... }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnimeStreamApp();
});