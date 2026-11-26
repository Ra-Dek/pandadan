const sections = document.querySelectorAll(".section")

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show")
                    observer.unobserve(entry.target)
                }
            })
        },
        {
            threshold: 0.1,
        },
    )

    sections.forEach(section => {
        observer.observe(section)
    })

    // Aktywujemy animacje dopiero po przygotowaniu obserwatora.
    document.documentElement.classList.add("js")
}

const menuToggle = document.querySelector(".menu-toggle")
const navigation = document.querySelector("#main-navigation")

if (menuToggle && navigation) {
	const setMenuState = isOpen => {
		navigation.classList.toggle("is-open", isOpen)

		menuToggle.setAttribute("aria-expanded", String(isOpen))
		menuToggle.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu")
	}

	menuToggle.addEventListener("click", () => {
		const isOpen = !navigation.classList.contains("is-open")

		setMenuState(isOpen)
	})

	document.addEventListener("click", event => {
		const clickedInsideMenu = navigation.contains(event.target)
		const clickedToggle = menuToggle.contains(event.target)
		const isOpen = navigation.classList.contains("is-open")

		if (isOpen && !clickedInsideMenu && !clickedToggle) {
			setMenuState(false)
		}
	})

	document.addEventListener("keydown", event => {
		if (event.key === "Escape" && navigation.classList.contains("is-open")) {
			setMenuState(false)
			menuToggle.focus()
		}
	})

	navigation.querySelectorAll("a").forEach(link => {
		link.addEventListener("click", () => {
			setMenuState(false)
		})
	})

	const desktopMedia = window.matchMedia("(min-width: 1251px)")

	desktopMedia.addEventListener("change", event => {
		if (event.matches) {
			setMenuState(false)
		}
	})
}

const trainingCards = document.querySelectorAll("#training .training-card")

trainingCards.forEach(card => {
	const heading = card.querySelector("h3")
	const toggle = card.querySelector(".training-toggle")

	// Pomijamy kartę, jeśli brakuje wymaganych elementów.
	if (!heading || !toggle) {
		return
	}

	const dayName = heading.textContent.trim().toLowerCase()

	// Domyślnie rozwijamy wszystkie dni treningowe.
	card.classList.add("is-open")

	toggle.setAttribute("aria-expanded", "true")
	toggle.setAttribute("aria-label", `Zwiń grafik: ${dayName}`)

	// Ręczne zwijanie i rozwijanie grafiku.
	toggle.addEventListener("click", () => {
		const isOpen = card.classList.toggle("is-open")

		toggle.setAttribute("aria-expanded", String(isOpen))
		toggle.setAttribute("aria-label", `${isOpen ? "Zwiń" : "Rozwiń"} grafik: ${dayName}`)
	})
})

const posterButtons = document.querySelectorAll(".event-poster")
const lightbox = document.querySelector(".poster-lightbox")

if (lightbox && typeof lightbox.showModal === "function") {
	const lightboxImage = lightbox.querySelector("img")
	const lightboxClose = lightbox.querySelector(".poster-lightbox-close")

	if (lightboxImage && lightboxClose) {
		posterButtons.forEach(button => {
			const posterImage = button.querySelector("img")

			if (!posterImage) {
				button.remove()
				return
			}

			const hidePoster = () => {
				button.remove()
			}

			posterImage.addEventListener("error", hidePoster)

			if (posterImage.complete && posterImage.naturalWidth === 0) {
				hidePoster()
				return
			}

			// Otwieranie powiększenia po kliknięciu plakatu.
			button.addEventListener("click", () => {
				if (!posterImage.naturalWidth) {
					return
				}

				lightboxImage.src = posterImage.currentSrc || posterImage.src

				lightboxImage.alt = posterImage.alt

				lightbox.showModal()
			})
		})

		// Zamykanie przyciskiem.
		lightboxClose.addEventListener("click", () => {
			lightbox.close()
		})

		// Zamykanie po kliknięciu tła dialogu.
		lightbox.addEventListener("click", event => {
			if (event.target === lightbox) {
				lightbox.close()
			}
		})

		lightbox.addEventListener("close", () => {
			lightboxImage.removeAttribute("src")
			lightboxImage.alt = ""
		})
	}
}
