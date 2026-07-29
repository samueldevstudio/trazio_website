// Gestione dinamica dei progetti dal file JSON
// Questo script carica i progetti da projects.json e li renderizza nelle pagine

class ProjectsManager {
  constructor() {
    this.projects = [];
    this.init();
  }

  async init() {
    try {
      const response = await fetch('js/projects.json');
      const data = await response.json();
      this.projects = data.projects;
      this.renderProjects();
    } catch (error) {
      console.error('Errore nel caricamento dei progetti:', error);
      this.renderFallback();
    }
  }

  renderProjects() {
    const containers = document.querySelectorAll('.projects-grid');
    
    containers.forEach(container => {
      container.innerHTML = this.projects.map((project, index) => {
        return this.createProjectCard(project, index);
      }).join('');
    });

    // Attiva le animazioni per i nuovi elementi
    if (typeof initScrollReveal === 'function') {
      initScrollReveal();
    }
  }

  createProjectCard(project, index) {
    const statusClass = this.getStatusClass(project.status);
    const statusLabel = this.getStatusLabel(project.status);
    const delay = index * 100;
    
    // Badge privato
    const privateBadge = project.isPrivate 
      ? `<span class="tag tag--private">Progetto Privato</span>` 
      : '';
    
    // Note privato
    const privateNote = project.isPrivate && project.privateNote
      ? `<p class="project-card__private-note">${project.privateNote}</p>`
      : '';

    // Link esterno
    const linkButton = project.externalLink
      ? `<a href="${project.externalLink}" target="_blank" rel="noopener" class="btn btn--secondary">Vedi Progetto</a>`
      : `<a href="projects/${project.id}.html" class="btn btn--secondary">Scopri di più</a>`;

    // Link GitHub
    const githubLink = project.githubLink
      ? `<a href="${project.githubLink}" target="_blank" rel="noopener" class="project-card__github" aria-label="GitHub">GitHub</a>`
      : '';

    return `
      <article class="card project-card reveal" data-delay="${delay}">
        <div class="project-card__media">
          <img src="${project.image}" alt="${project.title} - anteprima progetto" loading="lazy">
        </div>
        <div class="project-card__body">
          <h3 class="service-card__title">${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-card__tags">
            ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
            ${statusLabel ? `<span class="tag ${statusClass}">${statusLabel}</span>` : ''}
            ${privateBadge}
          </div>
          ${privateNote}
          <div class="project-card__actions">
            ${linkButton}
            ${githubLink}
          </div>
        </div>
      </article>
    `;
  }

  getStatusClass(status) {
    const statusClasses = {
      'completed': '',
      'in_development': 'tag--muted',
      'early_development': 'tag--muted',
      'on_hold': 'tag--warning'
    };
    return statusClasses[status] || 'tag--muted';
  }

  getStatusLabel(status) {
    const statusLabels = {
      'completed': '',
      'in_development': 'In sviluppo',
      'early_development': 'Early Development',
      'on_hold': 'In pausa'
    };
    return statusLabels[status] || '';
  }

  renderFallback() {
    // Fallback se il JSON non carica - mostra i progetti hardcoded
    console.warn('Usando fallback per i progetti');
  }
}

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager();
  });
} else {
  new ProjectsManager();
}
