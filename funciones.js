// Datos de ejemplo para la lista de animes seguidos
// Esta data podría venir de un localStorage o una API en una aplicación real.
const followedAnimesDataSource = [
    { id: 52991, title: "Sousou no Frieren", img: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg", currentEpisode: 28, totalEpisodes: 28, statusText: "Completado", type: "TV", rating: "9.3", genres: ["Aventura", "Drama", "Fantasía"] },
    { id: 5114, title: "Fullmetal Alchemist: Brotherhood", img: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg", currentEpisode: 64, totalEpisodes: 64, statusText: "Completado", type: "TV", rating: "9.1", genres: ["Acción", "Aventura", "Drama"] },
    { id: 40834, title: "Jujutsu Kaisen", img: "https://cdn.myanimelist.net/images/anime/1334/140131l.jpg", currentEpisode: 18, totalEpisodes: 24, statusText: "Viendo Ep. 18", type: "TV", rating: "8.6", genres: ["Acción", "Fantasía"] },
    { id: 51535, title: "[Oshi no Ko]", img: "https://cdn.myanimelist.net/images/anime/1808/140906l.jpg", currentEpisode: 5, totalEpisodes: 11, statusText: "Viendo Ep. 5", type: "TV", rating: "9.0", genres: ["Drama", "Sobrenatural"] },
    { id: 11061, title: "Hunter x Hunter (2011)", img: "https://cdn.myanimelist.net/images/anime/1337/99013l.jpg", currentEpisode: 75, totalEpisodes: 148, statusText: "Viendo Ep. 75", type: "TV", rating: "9.0", genres: ["Acción", "Aventura"] },
    { id: 1, title: "Cowboy Bebop", img: "https://cdn.myanimelist.net/images/anime/4/19644l.jpg", currentEpisode: 10, totalEpisodes: 26, statusText: "Viendo Ep. 10", type: "TV", rating: "8.7", genres: ["Acción", "Sci-Fi", "Espacial"] }
];

class AnimeStreamApp {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.initAnimations();
        this.initProfilePageFollowedList(); // Inicializa la lógica específica del perfil
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
            
            // Elementos específicos de la página de perfil
            followedAnimeGrid: document.getElementById('followedAnimeGrid'),
            followedCountSpan: document.getElementById('followedCount')
        };
        // Copia mutable de los datos para la lista de seguidos
        if (this.elements.followedAnimeGrid) {
             this.currentFollowedAnimes = [...followedAnimesDataSource];
        } else {
            this.currentFollowedAnimes = [];
        }
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
        // Guardar el observer en la instancia para poder usarlo después
        this.animationObserver = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-in');
                    observerInstance.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            if (this.animationObserver) {
                this.animationObserver.observe(element);
            }
        });
    }

    initProfilePageFollowedList() {
        if (this.elements.followedAnimeGrid && this.elements.followedCountSpan) {
            this.renderFollowedAnime();
        }
    }

    renderFollowedAnime() {
        const { followedAnimeGrid, followedCountSpan } = this.elements;

        if (!followedAnimeGrid || !followedCountSpan) {
            console.warn("Elementos del DOM para la lista de perfil no encontrados en renderFollowedAnime.");
            return;
        }

        followedCountSpan.innerHTML = `<i class="fas fa-bookmark mr-2"></i> ${this.currentFollowedAnimes.length} Animes en Mi Lista`;
        followedAnimeGrid.innerHTML = ''; 

        if (this.currentFollowedAnimes.length === 0) {
            followedAnimeGrid.innerHTML = `<p class="col-span-full text-center text-gray-400 py-10 text-lg">
                                            Tu lista está vacía. ¡<a href="catalogo.html" class="text-accent hover:underline">Explora el catálogo</a> y añade tus animes favoritos!
                                       </p>`;
            return;
        }

        this.currentFollowedAnimes.forEach((anime, index) => {
            const progressPercent = anime.totalEpisodes > 0 ? (anime.currentEpisode / anime.totalEpisodes) * 100 : 0;
            const genresHTML = (anime.genres || []).slice(0, 2).map(genre => 
                `<span class="bg-gray-700/80 text-gray-300 text-[0.65rem] px-2 py-0.5 rounded-full">${genre}</span>`
            ).join('');

            const cardHTML = `
                <div class="animate-on-scroll group relative flex flex-col card-item-bg backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden shadow-xl transition-all duration-300 ease-in-out hover:shadow-accent/25 hover:border-accent/50 transform hover:-translate-y-1.5">
                    <div class="relative aspect-[3/4.5] w-full">
                        <a href="ficha.html?id=${anime.id}" class="block w-full h-full group/image">
                            <img src="${anime.img}" alt="${anime.title}" class="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover/image:scale-105" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x450/1a1a1a/FFFFFF/?text=No+Disponible';this.classList.add('img-error');">
                        </a>
                        <button data-id="${anime.id}" data-index="${index}" class="unfollow-btn absolute top-2.5 right-2.5 z-30 w-8 h-8 flex items-center justify-center bg-red-600/90 hover:bg-red-500 rounded-full text-white transition-all duration-300 ease-in-out transform hover:scale-110" title="Dejar de Seguir">
                            <i class="fas fa-times text-sm"></i>
                        </button>
                        <span class="absolute top-2.5 left-2.5 z-20 bg-black/70 backdrop-blur-sm text-white text-[0.65rem] sm:text-xs font-semibold px-2.5 py-1 rounded-full">${anime.type || 'TV'}</span>
                    </div>
                    <div class="p-3 md:p-4 flex flex-col flex-grow">
                        <h3 class="text-sm md:text-base font-bold text-white truncate mb-1 group-hover:text-accent transition-colors duration-300" title="${anime.title}">
                            <a href="ficha.html?id=${anime.id}">${anime.title}</a>
                        </h3>
                        <div class="flex items-center justify-between text-xs text-gray-400 mb-2.5">
                            <span class="flex items-center"><i class="fas fa-star text-accent mr-1"></i> ${anime.rating || 'N/A'}</span>
                            <span class="text-right">${anime.statusText}</span>
                        </div>
                        ${anime.totalEpisodes > 0 ? `
                        <div class="w-full bg-gray-700/50 rounded-full h-1.5 mb-2.5 overflow-hidden progress-bar-container">
                            <div class="bg-accent h-1.5 rounded-full transition-all duration-500 ease-out" style="width: ${progressPercent.toFixed(0)}%;"></div>
                        </div>
                        ` : '<div class="h-1.5 mb-2.5"></div>'}
                        <div class="flex flex-wrap gap-1.5 mt-auto pt-1">
                            ${genresHTML}
                        </div>
                    </div>
                </div>
            `;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardHTML.trim();
            const newCardElement = tempDiv.firstChild;
            if (newCardElement) {
                followedAnimeGrid.appendChild(newCardElement);
                 if (newCardElement.classList.contains('animate-on-scroll') && this.animationObserver) {
                    this.animationObserver.observe(newCardElement);
                }
            }
        });
        this.bindUnfollowButtons();
    }

    bindUnfollowButtons() {
        // Asegurarse de que this.elements.followedAnimeGrid exista antes de usarlo.
        if (!this.elements.followedAnimeGrid) return;

        this.elements.followedAnimeGrid.querySelectorAll('.unfollow-btn').forEach(button => {
            if (button.dataset.listenerAttached === 'true') return; 
            button.dataset.listenerAttached = 'true';
            button.addEventListener('click', (event) => {
                const targetButton = event.currentTarget;
                const animeIndex = parseInt(targetButton.dataset.index);
                if (animeIndex >= 0 && animeIndex < this.currentFollowedAnimes.length) {
                    if (confirm(`¿Estás seguro de que quieres dejar de seguir "${this.currentFollowedAnimes[animeIndex].title}"?`)) {
                        this.currentFollowedAnimes.splice(animeIndex, 1);
                        this.renderFollowedAnime();
                    }
                } else {
                    console.error("Índice de anime no válido al intentar dejar de seguir. Índice:", animeIndex, "Array actual:", this.currentFollowedAnimes);
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnimeStreamApp();
});