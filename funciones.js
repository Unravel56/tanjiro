class AnimeStreamApp {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.initAnimations(); // Asegurarse que se llame
    }

    // Inicializar elementos del DOM
    initElements() {
        this.elements = {
            // Header y paneles móviles
            mainHeader: document.getElementById("mainHeader"), // Para scroll
            desktopSearchBtn: document.getElementById('desktopSearchBtn'),
            desktopSearchInputContainer: document.getElementById('desktopSearchInputContainer'),
            mobileMenuBtn: document.getElementById("mobileMenuBtn"),
            closeMobileMenu: document.getElementById("closeMobileMenu"),
            mobileMenu: document.getElementById("mobileMenu"),
            mobileSearchBtn: document.getElementById("mobileSearchBtn"),
            closeMobileSearch: document.getElementById("closeMobileSearch"),
            mobileSearchPanel: document.getElementById("mobileSearch"), // Renombrado en HTML y aquí para claridad
            
            // Búsqueda de episodios (específica de la página de ficha)
            episodeSearchInput: document.getElementById('episodeSearchInput'),
            // Otros elementos que podrían necesitarse globalmente
        };
    }

    // Vincular eventos
    bindEvents() {
        const { 
            mainHeader, desktopSearchBtn, desktopSearchInputContainer,
            mobileMenuBtn, closeMobileMenu, mobileMenu, 
            mobileSearchBtn, closeMobileSearch, mobileSearchPanel,
            episodeSearchInput 
        } = this.elements;

        // Evento de scroll para el header
        if (mainHeader) {
            const DUMMY_SCROLL_OFFSET = 50;
            window.addEventListener('scroll', () => {
                if (document.body.scrollTop > DUMMY_SCROLL_OFFSET || document.documentElement.scrollTop > DUMMY_SCROLL_OFFSET) {
                    mainHeader.classList.add('header-scrolled');
                } else {
                    mainHeader.classList.remove('header-scrolled');
                }
            });
        }

        // Búsqueda en Desktop
        if(desktopSearchBtn && desktopSearchInputContainer) {
            desktopSearchBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                desktopSearchInputContainer.classList.toggle('hidden');
                const input = desktopSearchInputContainer.querySelector('input');
                if(input && !desktopSearchInputContainer.classList.contains('hidden')) {
                    input.focus();
                }
            });
            // Ocultar input si se hace clic fuera
            document.addEventListener('click', (event) => {
                if (desktopSearchInputContainer && !desktopSearchInputContainer.classList.contains('hidden') && !desktopSearchInputContainer.contains(event.target) && event.target !== desktopSearchBtn && !desktopSearchBtn.contains(event.target)) {
                    desktopSearchInputContainer.classList.add('hidden');
                }
            });
        }

        // Eventos del menú móvil
        mobileMenuBtn?.addEventListener("click", (e) => this.handleMenuToggle(e, true));
        closeMobileMenu?.addEventListener("click", (e) => this.handleMenuToggle(e, false));

        // Eventos de búsqueda móvil
        mobileSearchBtn?.addEventListener("click", (e) => this.handleSearchToggle(e, true));
        closeMobileSearch?.addEventListener("click", (e) => this.handleSearchToggle(e, false));

        // Click fuera para cerrar paneles móviles (si el panel mismo es el overlay)
        mobileMenu?.addEventListener("click", (e) => {
            if (e.target === mobileMenu) this.closeAllPanels();
        });
        mobileSearchPanel?.addEventListener("click", (e) => { // Asumiendo que el panel de búsqueda también puede cerrarse así
             if (e.target === mobileSearchPanel) this.closeAllPanels();
        });


        // Teclado (Escape para cerrar paneles)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllPanels();
        });

        // Búsqueda GLOBAL (si se implementa un input global)
        // document.querySelectorAll('input[type="text"].global-search').forEach(input => {
        //     input.addEventListener('input', this.handleGlobalSearch);
        // });

        // Búsqueda de episodios (específica de la página de ficha)
        if (episodeSearchInput) {
            episodeSearchInput.addEventListener('input', () => {
                const filter = episodeSearchInput.value.toLowerCase().trim();
                const episodeCards = document.querySelectorAll('#episodes .episode-card'); // Asegúrate que #episodes es el contenedor
                
                episodeCards.forEach(card => {
                    const titleElement = card.querySelector('h3');
                    const episodeNumberElement = card.querySelector('p'); // Asume que el <p> tiene "Episodio X"
                    
                    const title = titleElement ? titleElement.textContent.toLowerCase() : "";
                    const episodeText = episodeNumberElement ? episodeNumberElement.textContent.toLowerCase() : "";
                    
                    const episodeNumberMatch = episodeText.match(/\d+/);
                    const episodeNumber = episodeNumberMatch ? episodeNumberMatch[0] : "";

                    const isVisible = title.includes(filter) || 
                                      episodeText.includes(filter) || 
                                      (filter.match(/^\d+$/) && episodeNumber === filter);
                    
                    card.style.display = isVisible ? "" : "none";
                });
            });
        }
    }

    // Manejar toggle del menú
    handleMenuToggle(e, open) {
        e.preventDefault();
        e.stopPropagation();
        
        if (open) {
            this.elements.mobileSearchPanel?.classList.remove("active"); // Usar el nombre correcto del elemento
            this.elements.mobileMenu?.classList.add("active");
            document.body.style.overflow = 'hidden'; // Evitar scroll del body
        } else {
            this.elements.mobileMenu?.classList.remove("active");
            document.body.style.overflow = '';
        }
    }

    // Manejar toggle de búsqueda móvil
    handleSearchToggle(e, open) {
        e.preventDefault();
        e.stopPropagation();
        
        if (open) {
            this.elements.mobileMenu?.classList.remove("active");
            this.elements.mobileSearchPanel?.classList.add("active"); // Usar el nombre correcto del elemento
            document.body.style.overflow = 'hidden'; // Evitar scroll del body
            
            setTimeout(() => { // Enfocar input
                const searchInput = this.elements.mobileSearchPanel?.querySelector('input[type="text"]');
                searchInput?.focus();
            }, 300); // Coincidir con la duración de la transición CSS
        } else {
            this.elements.mobileSearchPanel?.classList.remove("active"); // Usar el nombre correcto del elemento
            document.body.style.overflow = '';
        }
    }

    // Cerrar todos los paneles móviles
    closeAllPanels() {
        this.elements.mobileMenu?.classList.remove("active");
        this.elements.mobileSearchPanel?.classList.remove("active"); // Usar el nombre correcto del elemento
        document.body.style.overflow = '';
    }

    // Manejar búsqueda GLOBAL (ejemplo, no la de episodios)
    // handleGlobalSearch(e) {
    //     const searchTerm = e.target.value.toLowerCase();
    //     if (searchTerm.length > 2) {
    //         console.log('Global search for:', searchTerm);
    //         // Implementar funcionalidad de búsqueda global aquí
    //     }
    // }

    // Inicializar animaciones de entrada con IntersectionObserver
    initAnimations() {
        const observerOptions = {
            threshold: 0.1, // Activar cuando el 10% del elemento es visible
            rootMargin: '0px 0px -50px 0px' // Activar un poco antes de que entre completamente en viewport
        };

        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-in');
                    observerInstance.unobserve(entry.target); // Dejar de observar una vez animado
                }
            });
        }, observerOptions);

        // Observar elementos con la clase 'animate-on-scroll'
        // Añade esta clase a las secciones o tarjetas que quieres animar en el HTML
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AnimeStreamApp();
});