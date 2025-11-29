// Fonctionnalités de l'administration
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est déjà connecté
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    } else {
        showLoginForm();
    }
    
    // Configurer le formulaire de connexion
    var loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            
            // Vérifier les identifiants
            if (username === 'admin' && password === 'admin1503') {
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
            } else {
                alert('Identifiants incorrects. Veuillez réessayer.');
            }
        });
    }
    
    // Configurer le bouton de déconnexion
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            showLoginForm();
        });
    }
    
    // Configurer la navigation admin
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mettre à jour la navigation active
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Afficher la section correspondante
            var targetId = this.getAttribute('href').substring(1);
            showAdminSection(targetId);
        });
    });
    
    // Configurer les formulaires admin
    setupAdminForms();
});

// Afficher le formulaire de connexion
function showLoginForm() {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('admin-container').style.display = 'none';
}

// Afficher le panneau d'administration
function showAdminPanel() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-container').style.display = 'block';
    
    // Charger les données
    loadAdminDestinations();
    loadAdminTarifs();
    loadAdminOffres();
    loadAdminCommentaires();
    loadAdminReservations();
    loadPersonnalisationForm();
}

// Afficher une section d'administration
function showAdminSection(sectionId) {
    var sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    var targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Configurer les formulaires d'administration
function setupAdminForms() {
    // Formulaire d'ajout de destination
    var destinationForm = document.getElementById('destination-form');
    if (destinationForm) {
        destinationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(this);
            var destination = {
                nom: formData.get('nom'),
                description: formData.get('description'),
                image: formData.get('image')
            };
            
            db.addDestination(destination);
            loadAdminDestinations();
            this.reset();
            alert('Destination ajoutée avec succès !');
        });
    }
    
    // Formulaire de modification de tarif
    var tarifForm = document.getElementById('tarif-form');
    if (tarifForm) {
        tarifForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var destinationId = parseInt(document.getElementById('tarif-destination').value);
            var prix = parseFloat(document.getElementById('tarif-prix').value);
            
            if (destinationId && prix) {
                db.updateTarif(destinationId, prix);
                loadAdminTarifs();
                this.reset();
                alert('Tarif mis à jour avec succès !');
            }
        });
    }
    
    // Formulaire d'ajout d'offre
    var offreForm = document.getElementById('offre-form');
    if (offreForm) {
        offreForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(this);
            var offre = {
                titre: formData.get('titre'),
                description: formData.get('description'),
                reduction: parseInt(formData.get('reduction')),
                image: formData.get('image')
            };
            
            db.addOffre(offre);
            loadAdminOffres();
            this.reset();
            alert('Offre ajoutée avec succès !');
        });
    }
    
    // Formulaire de personnalisation
    var personnalisationForm = document.getElementById('personnalisation-form');
    if (personnalisationForm) {
        personnalisationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(this);
            var personnalisation = {
                couleurPrincipale: formData.get('couleur-principale'),
                couleurSecondaire: formData.get('couleur-secondaire'),
                imageFond: formData.get('image-fond'),
                logo: formData.get('logo')
            };
            
            db.updatePersonnalisation(personnalisation);
            alert('Personnalisation appliquée avec succès !');
        });
    }
}

// Charger les destinations dans l'admin
function loadAdminDestinations() {
    var destinations = db.getDestinations();
    var container = document.getElementById('destinations-list');
    var tarifSelect = document.getElementById('tarif-destination');
    
    container.innerHTML = '';
    if (tarifSelect) {
        tarifSelect.innerHTML = '<option value="">Sélectionnez une destination</option>';
    }
    
    destinations.forEach(destination => {
        // Ajouter à la liste
        var card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h4>${destination.nom}</h4>
                <p>${destination.description}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger" onclick="deleteDestination(${destination.id})">Supprimer</button>
            </div>
        `;
        container.appendChild(card);
        
        // Ajouter au select des tarifs
        if (tarifSelect) {
            var option = document.createElement('option');
            option.value = destination.id;
            option.textContent = destination.nom;
            tarifSelect.appendChild(option);
        }
    });
}

// Charger les tarifs dans l'admin
function loadAdminTarifs() {
    var tarifs = db.getTarifs();
    var destinations = db.getDestinations();
    var container = document.getElementById('tarifs-list');
    
    container.innerHTML = '';
    
    tarifs.forEach(tarif => {
        var destination = destinations.find(d => d.id === tarif.destinationId);
        if (destination) {
            var card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-info">
                    <h4>${destination.nom}</h4>
                    <p>${tarif.prix} € / personne</p>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

// Charger les offres dans l'admin
function loadAdminOffres() {
    var offres = db.getOffres();
    var container = document.getElementById('offres-list');
    
    container.innerHTML = '';
    
    offres.forEach(offre => {
        var card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h4>${offre.titre}</h4>
                <p>${offre.description}</p>
                <p>Réduction: ${offre.reduction}%</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger" onclick="deleteOffre(${offre.id})">Supprimer</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Charger les commentaires dans l'admin
function loadAdminCommentaires() {
    var commentaires = db.getCommentaires();
    var container = document.getElementById('commentaires-list');
    
    container.innerHTML = '';
    
    commentaires.forEach(commentaire => {
        var card = document.createElement('div');
        card.className = 'commentaire-card';
        card.innerHTML = `
            <div class="commentaire-header">
                <span class="commentaire-nom">${commentaire.nom}</span>
                <span class="commentaire-date">${formatDate(commentaire.date)}</span>
            </div>
            <div class="commentaire-message">
                <p>${commentaire.message}</p>
            </div>
            <div class="commentaire-actions">
                ${!commentaire.approuve ? 
                    `<button class="btn btn-success" onclick="approuverCommentaire(${commentaire.id})">Approuver</button>` : 
                    '<span class="statut approuve">Approuvé</span>'
                }
                <button class="btn btn-danger" onclick="supprimerCommentaire(${commentaire.id})">Supprimer</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Charger les réservations dans l'admin
function loadAdminReservations() {
    var reservations = db.getReservations();
    var destinations = db.getDestinations();
    var container = document.getElementById('reservations-list');
    
    container.innerHTML = '';
    
    reservations.forEach(reservation => {
        var destination = destinations.find(d => d.id === reservation.destinationId);
        var destinationName = destination ? destination.nom : 'Destination inconnue';
        
        var card = document.createElement('div');
        card.className = 'reservation-card';
        card.innerHTML = `
            <div class="reservation-header">
                <span class="reservation-nom">${reservation.nom}</span>
                <span class="reservation-date">${formatDate(reservation.dateReservation)}</span>
            </div>
            <div class="reservation-details">
                <p><strong>Email:</strong> ${reservation.email}</p>
                <p><strong>Téléphone:</strong> ${reservation.telephone}</p>
                <p><strong>Destination:</strong> ${destinationName}</p>
                <p><strong>Date de voyage:</strong> ${formatDate(reservation.date)}</p>
                <p><strong>Nombre de personnes:</strong> ${reservation.nombre}</p>
                ${reservation.message ? `<p><strong>Message:</strong> ${reservation.message}</p>` : ''}
                <p><strong>Statut:</strong> <span class="statut ${reservation.statut}">${reservation.statut}</span></p>
            </div>
            <div class="reservation-actions">
                ${reservation.statut === 'en attente' ? 
                    `<button class="btn btn-success" onclick="accepterReservation(${reservation.id})">Accepter</button>
                     <button class="btn btn-danger" onclick="refuserReservation(${reservation.id})">Refuser</button>` : 
                    ''
                }
            </div>
        `;
        container.appendChild(card);
    });
}

// Charger le formulaire de personnalisation
function loadPersonnalisationForm() {
    var personnalisation = db.getPersonnalisation();
    
    document.getElementById('couleur-principale').value = personnalisation.couleurPrincipale || '#1a5276';
    document.getElementById('couleur-secondaire').value = personnalisation.couleurSecondaire || '#3498db';
    document.getElementById('image-fond').value = personnalisation.imageFond || '';
    document.getElementById('logo').value = personnalisation.logo || '';
}

// Fonctions pour les actions admin
function deleteDestination(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette destination ?')) {
        db.deleteDestination(id);
        loadAdminDestinations();
    }
}

function deleteOffre(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
        db.deleteOffre(id);
        loadAdminOffres();
    }
}

function approuverCommentaire(id) {
    db.approuverCommentaire(id);
    loadAdminCommentaires();
}

function supprimerCommentaire(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
        db.supprimerCommentaire(id);
        loadAdminCommentaires();
    }
}

function accepterReservation(id) {
    db.accepterReservation(id);
    loadAdminReservations();
}

function refuserReservation(id) {
    db.refuserReservation(id);
    loadAdminReservations();
}

// Formater une date
function formatDate(dateString) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}