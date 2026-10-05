// Gestione dinamica dei progetti dal file JSON
// Questo script carica i progetti da projects.json e li renderizza nelle pagine.
// Ogni contenitore .projects-grid può indicare:
//   data-group="client" | "lab"  → quali progetti mostrare (default: tutti)
//   data-layout="list"           → righe di testo invece delle card con copertina

class ProjectsManager {
  constructor() {
    this.projects = [];
    this.init();
  }

  async init() {
    // Nessuna griglia in pagina: niente fetch inutile
    if (!document.querySelector('.projects-grid')) return;
    try {
      const response = await fetch('js/projects.json');
      const data = await response.json();
      this.projects = data.projects;
      this.renderProjects();
    } catch (error) {
      console.error('Errore nel caricamento dei progetti:', error);
    }
  }

  renderProjects() {
    const containers = document.querySelectorAll('.projects-grid');

    containers.forEach(container => {
      const group = container.dataset.group;
      const asList = container.dataset.layout === 'list';
      const projects = group
        ? this.projects.filter(project => project.group === group)
        : this.projects;

      container.innerHTML = projects.map((project, index) => {
        return asList ? this.createProjectRow(project) : this.createProjectCard(project, index);
      }).join('');
    });

    // Attiva le animazioni e il fallback immagini per i nuovi elementi
    if (typeof initScrollReveal === 'function') initScrollReveal();
    if (typeof initImageFallback === 'function') initImageFallback();
  }

  // I dati del JSON finiscono in innerHTML: li tratto sempre come testo,
  // così un valore con < > " ' & non può mai diventare markup o script
  escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  // "In sviluppo · HTML, CSS, JavaScript"
  getMeta(project) {
    const status = this.getStatusLabel(project.status);
    const tech = project.technologies.join(', ');
    return this.escape(status ? `${status} · ${tech}` : tech);
  }

  // Link esterni solo http(s): blocca URL come javascript:
  getLink(project) {
    return /^https?:\/\//i.test(project.externalLink || '')
      ? `href="${this.escape(project.externalLink)}" target="_blank" rel="noopener"`
      : `href="projects/${encodeURIComponent(project.id)}.html"`;
  }

  createProjectCard(project, index) {
    const delay = index * 100;
    const title = this.escape(project.title);

    const privateNote = project.isPrivate && project.privateNote
      ? `<p class="project-card__private-note">${this.escape(project.privateNote)}</p>`
      : '';

    return `
      <article class="project-card reveal" data-delay="${delay}">
        <div class="project-card__media">
          <img src="${this.escape(project.image)}" alt="${title} - anteprima progetto" loading="lazy">
        </div>
        <div class="project-card__body">
          <p class="project-card__meta">${this.getMeta(project)}</p>
          <h3 class="project-card__title"><a ${this.getLink(project)}>${title}</a></h3>
          <p>${this.escape(project.description)}</p>
          ${privateNote}
        </div>
      </article>
    `;
  }

  createProjectRow(project) {
    return `
      <a ${this.getLink(project)} class="service-row">
        <div class="service-content">
          <h3>${this.escape(project.title)}</h3>
          <p>${this.escape(project.description)}</p>
          <p class="service-row__meta">${this.getMeta(project)}</p>
        </div>
        <span class="service-arrow" aria-hidden="true">↗</span>
      </a>
    `;
  }

  getStatusLabel(status) {
    const statusLabels = {
      'completed': '',
      'in_development': 'In sviluppo',
      'early_development': 'Fase iniziale',
      'on_hold': 'In pausa'
    };
    return statusLabels[status] || '';
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
