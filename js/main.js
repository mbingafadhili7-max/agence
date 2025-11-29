// Fonctionnalités principales du site
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'interface
    initInterface();
    
    // Charger les données
    loadDestinations();
    loadTarifs();
    loadOffres();
    loadCommentaires();
    
    // Gérer les formulaires
    setupFormHandlers();
    
    // Appliquer la personnalisation
    applyCustomization();
});

// Initialiser l'interface
function initInterface() {
    // Navigation fluide
    var navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                var targetId = this.getAttribute('href').substring(1);
                var targetSection = document.getElementById(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Charger les destinations
function loadDestinations() {
    var destinations = db.getDestinations();
    var container = document.getElementById('destinations-container');
    var select = document.getElementById('destination');
    
    container.innerHTML = '';
    select.innerHTML = '<option value="">Sélectionnez une destination</option>';
    
    destinations.forEach(destination => {
        // Ajouter à la grille
        var card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${destination.image}" alt="${destination.nom}">
            <div class="card-content">
                <h3>${destination.nom}</h3>
                <p>${destination.description}</p>
            </div>
        `;
        container.appendChild(card);
        
        // Ajouter au select de réservation
        var option = document.createElement('option');
        option.value = destination.id;
        option.textContent = destination.nom;
        select.appendChild(option);
    });
}

// Charger les tarifs
function loadTarifs() {
    var tarifs = db.getTarifs();
    var destinations = db.getDestinations();
    var container = document.getElementById('tarifs-container');
    
    container.innerHTML = '';
    
    tarifs.forEach(tarif => {
        var destination = destinations.find(d => d.id === tarif.destinationId);
        if (destination) {
            var card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-content">
                    <h3>${destination.nom}</h3>
                    <p class="prix">${tarif.prix} € / personne</p>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

// Charger les offres
function loadOffres() {
    var offres = db.getOffres();
    var container = document.getElementById('offres-container');
    
    container.innerHTML = '';
    
    offres.forEach(offre => {
        var card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${offre.image}" alt="${offre.titre}">
            <div class="card-content">
                <h3>${offre.titre}</h3>
                <p>${offre.description}</p>
                <p class="reduction">-${offre.reduction}%</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Charger les commentaires
function loadCommentaires() {
    var commentaires = db.getCommentairesApprouves();
    var container = document.getElementById('commentaires-container');
    
    container.innerHTML = '';
    
    commentaires.forEach(commentaire => {
        var div = document.createElement('div');
        div.className = 'commentaire';
        div.innerHTML = `
            <div class="commentaire-header">
                <span class="commentaire-nom">${commentaire.nom}</span>
                <span class="commentaire-date">${formatDate(commentaire.date)}</span>
            </div>
            <div class="commentaire-message">
                <p>${commentaire.message}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

// Configurer les gestionnaires de formulaires
function setupFormHandlers() {
    // Formulaire de réservation
    var reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(this);
            var reservation = {
                nom: formData.get('nom'),
                email: formData.get('email'),
                telephone: formData.get('telephone'),
                destinationId: parseInt(formData.get('destination')),
                date: formData.get('date'),
                nombre: parseInt(formData.get('nombre')),
                message: formData.get('message')
            };
            
            // Ajouter la réservation
            db.addReservation(reservation);
            
            // Envoyer un email (simulation)
            sendEmail(
                'sikatendajacques02@gmail.com',
                `Demande de réservation - ${reservation.nom}`,
                `Nouvelle demande de réservation:\n\nNom: ${reservation.nom}\nEmail: ${reservation.email}\nTéléphone: ${reservation.telephone}\nDestination: ${getDestinationName(reservation.destinationId)}\nDate: ${reservation.date}\nNombre de personnes: ${reservation.nombre}\nMessage: ${reservation.message}`
            );
            
            // Afficher un message de confirmation
            alert('Votre réservation a été envoyée avec succès ! Nous vous contacterons bientôt.');
            this.reset();
        });
    }
    
    // Formulaire de contact
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(this);
            var message = {
                nom: formData.get('nom'),
                email: formData.get('email'),
                sujet: formData.get('sujet'),
                message: formData.get('message')
            };
            
            // Envoyer un email (simulation)
            sendEmail(
                'sikatendajacques02@gmail.com',
                message.sujet,
                `Message de ${message.nom} (${message.email}):\n\n${message.message}`
            );
            
            // Afficher un message de confirmation
            alert('Votre message a été envoyé avec succès !');
            this.reset();
        });
    }
    
    // Formulaire de commentaire
    var commentaireForm = document.getElementById('commentaire-form');
    if (commentaireForm) {
        commentaireForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(this);
            var commentaire = {
                nom: formData.get('nom'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // Ajouter le commentaire
            db.addCommentaire(commentaire);
            
            // Afficher un message de confirmation
            alert('Votre commentaire a été soumis et sera publié après approbation. Merci !');
            this.reset();
        });
    }
}

// Envoyer un email (simulation)
function sendEmail(to, subject, body) {
    // Dans un environnement réel, vous utiliseriez un service d'envoi d'emails
    // Pour cette démonstration, nous allons simplement logger l'email
    console.log(`Email envoyé à: ${to}`);
    console.log(`Sujet: ${subject}`);
    console.log(`Corps: ${body}`);
    
    // Vous pouvez intégrer un service comme EmailJS ou un backend pour envoyer de vrais emails
}

// Obtenir le nom d'une destination par son ID
function getDestinationName(id) {
    var destinations = db.getDestinations();
    var destination = destinations.find(d => d.id === id);
    return destination ? destination.nom : 'Destination inconnue';
}

// Formater une date
function formatDate(dateString) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Appliquer la personnalisation
function applyCustomization() {
    var personnalisation = db.getPersonnalisation();
    
    // Appliquer les couleurs
    if (personnalisation.couleurPrincipale) {
        document.documentElement.style.setProperty('--primary-color', personnalisation.couleurPrincipale);
    }
    
    if (personnalisation.couleurSecondaire) {
        document.documentElement.style.setProperty('--secondary-color', personnalisation.couleurSecondaire);
    }
    
    // Appliquer l'image de fond
    if (personnalisation.imageFond) {
        var hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${personnalisation.imageFond}')`;
        }
    }
    
    // Appliquer le logo
    if (personnalisation.logo) {
        var logo = document.querySelector('.logo');
        if (logo) {
            logo.innerHTML = `<img src="${personnalisation.logo}" alt="MV EL-SHADDAI">`;
        }
    }
}


// Gestion du menu mobile
function initMobileMenu() {
    var menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
    
    var headerContainer = document.querySelector('header .container');
    var nav = document.querySelector('nav');
    
    // Insérer le bouton menu dans le header
    headerContainer.insertBefore(menuToggle, nav);
    
    // Gérer le clic sur le bouton menu
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        var isExpanded = nav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        menuToggle.innerHTML = isExpanded ? '✕' : '☰';
        menuToggle.setAttribute('aria-label', isExpanded ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    
    // Fermer le menu quand on clique sur un lien
    var navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
        });
    });
    
    // Fermer le menu quand on redimensionne la fenêtre au-dessus de 768px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.innerHTML = '☰';
            menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
        }
    });
}

// Appeler la fonction dans DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    // ... le reste de votre code d'initialisation
});