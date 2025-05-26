
        // JavaScript optimizado y minificado
        class AnimeStreamApp {
            constructor() {
                this.initElements();
                this.bindEvents();
                this.initAnimations();
            }

            // Inicializar elementos del DOM
            initElements() {
                this.elements = {
                    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
                    closeMobileMenu: document.getElementById("closeMobileMenu"),
                    mobileMenu: document.getElementById("mobileMenu"),
                    mobileSearchBtn: document.getElementById("mobileSearchBtn"),
                    closeMobileSearch: document.getElementById("closeMobileSearch"),
                    mobileSearch: document.getElementById("mobileSearch")
                };
            }

            // Vincular eventos
            bindEvents() {
                const { mobileMenuBtn, closeMobileMenu, mobileMenu, mobileSearchBtn, closeMobileSearch, mobileSearch } = this.elements;

                // Eventos del menú móvil
                mobileMenuBtn?.addEventListener("click", (e) => this.handleMenuToggle(e, true));
                closeMobileMenu?.addEventListener("click", (e) => this.handleMenuToggle(e, false));

                // Eventos de búsqueda móvil
                mobileSearchBtn?.addEventListener("click", (e) => this.handleSearchToggle(e, true));
                closeMobileSearch?.addEventListener("click", (e) => this.handleSearchToggle(e, false));

                // Click fuera para cerrar
                mobileMenu?.addEventListener("click", (e) => {
                    if (e.target === mobileMenu) this.closeAllPanels();
                });

                // Teclado
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.closeAllPanels();
                });

                // Búsqueda
                document.querySelectorAll('input[type="text"]').forEach(input => {
                    input.addEventListener('input', this.handleSearch);
                });
            }

            // Manejar toggle del menú
            handleMenuToggle(e, open) {
                e.preventDefault();
                e.stopPropagation();
                
                if (open) {
                    this.elements.mobileSearch?.classList.remove("active");
                    this.elements.mobileMenu?.classList.add("active");
                } else {
                    this.elements.mobileMenu?.classList.remove("active");
                }
            }

            // Manejar toggle de búsqueda
            handleSearchToggle(e, open) {
                e.preventDefault();
                e.stopPropagation();
                
                if (open) {
                    this.elements.mobileMenu?.classList.remove("active");
                    this.elements.mobileSearch?.classList.add("active");
                    
                    // Enfocar input
                    setTimeout(() => {
                        const searchInput = this.elements.mobileSearch?.querySelector('input[type="text"]');
                        searchInput?.focus();
                    }, 300);
                } else {
                    this.elements.mobileSearch?.classList.remove("active");
                }
            }

            // Cerrar todos los paneles
            closeAllPanels() {
                this.elements.mobileMenu?.classList.remove("active");
                this.elements.mobileSearch?.classList.remove("active");
            }

            // Manejar búsqueda
            handleSearch(e) {
                const searchTerm = e.target.value.toLowerCase();
                if (searchTerm.length > 2) {
                    console.log('Searching for:', searchTerm);
                    // Implementar funcionalidad de búsqueda aquí
                }
            }

            // Inicializar animaciones
            initAnimations() {
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('slide-in');
                        }
                    });
                }, observerOptions);

                // Observar cards
                document.querySelectorAll('.anime-card, .series-card').forEach(card => {
                    observer.observe(card);
                });
            }
        }

        // Inicializar aplicación cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            new AnimeStreamApp();
        });
