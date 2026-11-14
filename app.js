/**
 * Configurador de orçamento — usa LUCAS_PRICING.
 * Slider e botões convivem: o preço oficial vem sempre de calculate().
 */
'use strict';

(function () {
  if (!window.LUCAS_PRICING) {
    console.error('LUCAS_PRICING não carregado');
    return;
  }

  const P = window.LUCAS_PRICING;
  const SLIDER_MAX = 750;

  const EMPTY_STATE = {
    type: null,
    pages: [],
    features: [],
    integrations: [],
    ia: [],
    automation: [],
    extras: [],
    name: '',
    notes: '',
  };

  const PACKAGES = [
    {
      max: 0,
      state: EMPTY_STATE,
    },
    {
      max: 150,
      state: {
        type: 'landing',
        pages: ['home', 'contato'],
        features: ['responsivo', 'whatsapp'],
        integrations: [],
        ia: [],
        automation: [],
        extras: [],
      },
    },
    {
      max: 300,
      state: {
        type: 'profissional',
        pages: ['home', 'sobre', 'servicos', 'contato'],
        features: ['responsivo', 'whatsapp', 'formulario'],
        integrations: [],
        ia: [],
        automation: [],
        extras: [],
      },
    },
    {
      max: 450,
      state: {
        type: 'avancado',
        pages: ['home', 'sobre', 'servicos', 'contato'],
        features: ['responsivo', 'whatsapp', 'formulario', 'agendamento'],
        integrations: ['whatsappApi'],
        ia: [],
        automation: [],
        extras: [],
      },
    },
    {
      max: 600,
      state: {
        type: 'avancado',
        pages: ['home', 'sobre', 'servicos', 'contato', 'depoimentos'],
        features: ['responsivo', 'whatsapp', 'formulario', 'agendamento', 'admin', 'database'],
        integrations: ['whatsappApi', 'email'],
        ia: [],
        automation: ['notificacoes'],
        extras: [],
      },
    },
    {
      max: 750,
      state: {
        type: 'sistema',
        pages: ['home', 'contato'],
        features: ['responsivo', 'whatsapp', 'formulario', 'login', 'cadastro', 'admin', 'database', 'dashboard'],
        integrations: ['api', 'email'],
        ia: ['chatbot'],
        automation: ['fluxos'],
        extras: [],
      },
    },
  ];

  let draggingSlider = false;

  function selectedIds(selector, key) {
    return Array.from(document.querySelectorAll('.option-btn.selected' + selector)).map(function (btn) {
      return btn.dataset[key];
    }).filter(Boolean);
  }

  function getNotes() {
    var el = document.getElementById('ai-description');
    return el ? el.value.trim() : '';
  }

  function getStateFromUI() {
    var typeBtn = document.querySelector('.option-btn.selected[data-type]');
    return {
      type: typeBtn ? typeBtn.dataset.type : null,
      pages: selectedIds('[data-page]', 'page'),
      features: selectedIds('[data-func]', 'func'),
      integrations: selectedIds('[data-int]', 'int'),
      ia: selectedIds('[data-ia]', 'ia'),
      automation: selectedIds('[data-auto]', 'auto'),
      extras: selectedIds('[data-extra]', 'extra'),
      name: '',
      notes: getNotes(),
    };
  }

  function setGroup(selector, key, ids) {
    var set = {};
    (ids || []).forEach(function (id) {
      set[id] = true;
    });
    document.querySelectorAll('.option-btn' + selector).forEach(function (btn) {
      var on = !!set[btn.dataset[key]];
      btn.classList.toggle('selected', on);
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  function applyStateToUI(state) {
    document.querySelectorAll('.option-btn[data-type]').forEach(function (btn) {
      var on = !!state.type && btn.dataset.type === state.type;
      btn.classList.toggle('selected', on);
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    setGroup('[data-page]', 'page', state.pages);
    setGroup('[data-func]', 'func', state.features);
    setGroup('[data-int]', 'int', state.integrations);
    setGroup('[data-ia]', 'ia', state.ia);
    setGroup('[data-auto]', 'auto', state.automation);
    setGroup('[data-extra]', 'extra', state.extras);
  }

  function packageForSlider(value) {
    var n = Number(value);
    if (!n || n <= 0) return PACKAGES[0].state;
    for (var i = 0; i < PACKAGES.length; i++) {
      if (n <= PACKAGES[i].max) return PACKAGES[i].state;
    }
    return PACKAGES[PACKAGES.length - 1].state;
  }

  function tierFromTotal(total) {
    if (!total || total <= 0) return 'empty';
    if (total < 150) return 'basic';
    if (total < 300) return 'plus';
    if (total < 450) return 'mid';
    if (total < 600) return 'advanced';
    return 'premium';
  }

  function tierLabel(tier) {
    return {
      empty: 'Comece pelo tipo de projeto',
      basic: 'Básico',
      plus: 'Com mais recursos',
      mid: 'Intermediário',
      advanced: 'Avançado',
      premium: 'Completo / premium',
    }[tier] || '';
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function fillSummaryLine(root, key, value) {
    var line = root.querySelector('[data-summary="' + key + '"] span');
    if (line) line.textContent = value || '—';
  }

  function namesFrom(group, ids) {
    return P.selectedNames(group, ids).join(', ');
  }

  function updateProjectSummary(state, estimate) {
    var summary = document.getElementById('project-summary');
    if (!summary) return;
    var typeName = state.type && P.TYPES[state.type] ? P.TYPES[state.type].name : '—';

    var elType = document.getElementById('summary-type-label');
    if (elType) elType.textContent = typeName || 'Projeto';

    var elPages = document.getElementById('summary-pages');
    if (elPages) elPages.textContent = namesFrom(P.PAGES, state.pages) || '—';

    var elFeat = document.getElementById('summary-features');
    if (elFeat) elFeat.textContent = namesFrom(P.FEATURES, state.features) || '—';

    var elInt = document.getElementById('summary-integrations');
    if (elInt) elInt.textContent = namesFrom(P.INTEGRATIONS, state.integrations) || '—';

    var elIa = document.getElementById('summary-ia');
    if (elIa) elIa.textContent = namesFrom(P.IA, state.ia) || '—';

    var elAuto = document.getElementById('summary-automation');
    if (elAuto) elAuto.textContent = namesFrom(P.AUTOMATION, state.automation) || '—';

    var elExtras = document.getElementById('summary-extras');
    if (elExtras) elExtras.textContent = namesFrom(P.EXTRAS, state.extras) || '—';

    var elBadge = document.getElementById('summary-complexity');
    if (elBadge) {
      var badgeText = (estimate.complexity && estimate.complexity.label) ? estimate.complexity.label : '—';
      elBadge.textContent = badgeText;
      elBadge.style.display = (state.type || (state.pages && state.pages.length > 0) || (state.features && state.features.length > 0)) ? 'inline-block' : 'none';
    }

    var estVal = summary.querySelector('.estimate-value');
    if (estVal) estVal.textContent = estimate.total ? 'R$ ' + P.formatBRL(estimate.total) : 'R$ —';

    // Controlar visibilidade do resumo
    var hasContent = state.type || (state.pages && state.pages.length > 0) || (state.features && state.features.length);
    var linesEl = summary.querySelector('.summary-lines');
    if (linesEl) linesEl.style.display = hasContent ? 'flex' : 'none';
    var estEl = summary.querySelector('.summary-estimate');
    if (estEl) estEl.style.display = hasContent ? 'flex' : 'none';
    var headerEl = summary.querySelector('.summary-header');
    if (headerEl) headerEl.style.display = hasContent ? 'flex' : 'none';

    var rangeEl = document.getElementById('price-range');
    if (rangeEl) {
      rangeEl.textContent = estimate.total
        ? 'Faixa estimada: ' + P.formatRange(estimate.min, estimate.max)
        : 'Arraste o controle ou escolha um tipo para ver a estimativa';
    }
  }

  function updateMockup(total) {
    var mock = document.getElementById('mini-site-container');
    if (!mock) return;
    var tier = tierFromTotal(total);
    mock.setAttribute('data-tier', tier);
    setText('mini-tier-label', tierLabel(tier));
    unlockEvolution(tier);

    // Atualização visual baseada nos recursos selecionados
    var state = getStateFromUI();
    var features = state.features || [];
    var pages = state.pages || [];

    // Mostrar/ocultar elementos do preview conforme recursos
    var hasWhatsApp = features.indexOf('whatsapp') !== -1;
    var hasForm = features.indexOf('formulario') !== -1;
    var hasLogin = features.indexOf('login') !== -1;
    var hasAgenda = features.indexOf('agendamento') !== -1;
    var hasAdmin = features.indexOf('admin') !== -1;
    var hasDB = features.indexOf('database') !== -1;

    // Ajustar conteúdo dinâmico do preview
    var heroTitle = mock.querySelector('.mini-hero-content .mini-hero-title');
    if (heroTitle) {
      if (tier === 'premium') heroTitle.textContent = 'Sistema completo — pronto para operar';
      else if (tier === 'advanced') heroTitle.textContent = 'Projeto avançado em construção';
      else if (tier === 'mid') heroTitle.textContent = 'Site profissional sendo montado';
      else if (tier === 'plus') heroTitle.textContent = 'Projeto básico em evolução';
      else heroTitle.textContent = 'Construindo seu projeto digital';
    }
  }

  function unlockEvolution(tier) {
    const tiers = ['empty', 'basic', 'plus', 'mid', 'advanced', 'premium'];
    const tierIndex = tiers.indexOf(tier);

    // Map de quais itens desbloqueiam em cada tier
    const unlockMap = {
      empty: [],
      basic: ['evo-header', 'evo-hero', 'evo-responsive'],
      plus: ['evo-services'],
      mid: ['evo-features', 'evo-cards'],
      advanced: ['evo-form', 'evo-contact', 'evo-whatsapp', 'evo-seo'],
      premium: ['evo-booking', 'evo-footer'],
    };

    // Resetar todos os itens primeiro
    document.querySelectorAll('.evolution-item').forEach(el => {
      el.classList.remove('unlocked');
    });

    if (tierIndex < 0) return;

    // Desbloquear itens do tier atual e anteriores
    for (let i = 0; i <= tierIndex; i++) {
      const t = tiers[i];
      (unlockMap[t] || []).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('unlocked');
      });
    }
  }

  function updateSlider(total) {
    var slider = document.getElementById('budget-slider');
    if (!slider || draggingSlider) return;
    slider.value = String(Math.max(0, Math.min(SLIDER_MAX, total || 0)));
  }

  function updateWhatsAppLinks(state, estimate) {
    var msg = P.buildWhatsAppMessage(state, estimate);
    var url = 'https://wa.me/' + P.WHATSAPP + '?text=' + encodeURIComponent(msg);
    ['whatsapp-cta', 'whatsapp-cta-final', 'whatsapp-cta-contact'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('href', url);
    });
  }

  function render() {
    var state = getStateFromUI();
    var estimate = P.calculate(state);
    var total = estimate.total || 0;

    setText('price-display', 'R$ ' + P.formatBRL(total));

    var note = document.getElementById('price-note');
    if (note) {
      if (!state.type) {
        note.textContent = 'Estimativa aproximada — preço final depende do escopo';
      } else if (total > SLIDER_MAX) {
        note.textContent = 'Acima da faixa do slider — o valor calculado continua valendo';
      } else {
        note.textContent = 'Estimativa aproximada — preço final depende do escopo';
      }
    }

    var bar = document.getElementById('complexity-bar');
    if (bar) {
      var level = (estimate.complexity && estimate.complexity.level) || 0;
      bar.querySelectorAll('span').forEach(function (span, index) {
        span.classList.toggle('filled', index < level);
      });
    }
    setText(
      'complexity-label',
      'Complexidade: ' + ((estimate.complexity && estimate.complexity.label) || '—')
    );

    updateProjectSummary(state, estimate);
    updateMockup(total);
    updateSlider(total);
    updateWhatsAppLinks(state, estimate);
  }

  function setupButtons() {
    var radioGroup = document.querySelector('[role="radiogroup"]');
    var radioButtons = radioGroup
      ? Array.from(radioGroup.querySelectorAll('[role="radio"]'))
      : [];
    var initialRadio = radioButtons.find(function (button) {
      return button.getAttribute('aria-checked') === 'true';
    }) || radioButtons[0];

    radioButtons.forEach(function (button) {
      button.tabIndex = button === initialRadio ? 0 : -1;
    });

    document.querySelectorAll('.option-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isType = btn.hasAttribute('data-type');
        if (isType) {
          document.querySelectorAll('.option-btn[data-type]').forEach(function (other) {
            other.classList.remove('selected');
            other.setAttribute('aria-checked', 'false');
            other.tabIndex = -1;
          });
          btn.classList.add('selected');
          btn.setAttribute('aria-checked', 'true');
          btn.tabIndex = 0;
        } else {
          var on = !btn.classList.contains('selected');
          btn.classList.toggle('selected', on);
          btn.setAttribute('aria-checked', on ? 'true' : 'false');
        }
        render();
      });
    });

    if (radioGroup && radioButtons.length) {
      radioGroup.addEventListener('keydown', function (event) {
        var currentIndex = radioButtons.indexOf(document.activeElement);
        if (currentIndex < 0) return;

        var nextIndex = currentIndex;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % radioButtons.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextIndex = (currentIndex - 1 + radioButtons.length) % radioButtons.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = radioButtons.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        radioButtons[nextIndex].focus();
        radioButtons[nextIndex].click();
      });
    }
  }

  function setupSlider() {
    var slider = document.getElementById('budget-slider');
    if (!slider) return;

    slider.addEventListener('pointerdown', function () {
      draggingSlider = true;
    });
    window.addEventListener('pointerup', function () {
      if (!draggingSlider) return;
      draggingSlider = false;
      render();
    });

    slider.addEventListener('input', function () {
      draggingSlider = true;
      applyStateToUI(packageForSlider(slider.value));
      render();
    });

    slider.addEventListener('change', function () {
      draggingSlider = false;
      render();
    });
  }

  function setupWhatsApp() {
    function openPrefill(event) {
      var state = getStateFromUI();
      var estimate = P.calculate(state);
      var url = 'https://wa.me/' + P.WHATSAPP + '?text=' + encodeURIComponent(
        P.buildWhatsAppMessage(state, estimate)
      );
      var el = event.currentTarget;
      if (el && el.tagName === 'A') {
        el.setAttribute('href', url);
      }
    }
    ['whatsapp-cta', 'whatsapp-cta-final', 'whatsapp-cta-contact'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', openPrefill);
    });
  }

  function setupContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var feedbackEl = document.createElement('div');
    feedbackEl.className = 'contact-form-feedback';
    feedbackEl.style.display = 'none';
    feedbackEl.setAttribute('role', 'status');
    form.appendChild(feedbackEl);

    var whatsappInput = document.getElementById('contact-whatsapp');
    if (whatsappInput) {
      whatsappInput.addEventListener('input', function (e) {
        var v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 6) {
          e.target.value = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
        } else if (v.length > 2) {
          e.target.value = '(' + v.slice(0, 2) + ') ' + v.slice(2);
        } else if (v.length > 0) {
          e.target.value = '(' + v;
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = document.getElementById('contact-name');
      var whatsappEl = document.getElementById('contact-whatsapp');
      var typeSel = document.getElementById('contact-project-type');
      var messageEl = document.getElementById('contact-message');

      var name = nameEl ? nameEl.value.trim() : '';
      var whatsapp = whatsappEl ? whatsappEl.value.trim() : '';
      var typeLabel = typeSel && typeSel.options[typeSel.selectedIndex]
        ? typeSel.options[typeSel.selectedIndex].text
        : '';
      var message = messageEl ? messageEl.value.trim() : '';

      if (!name || !whatsapp || !message) {
        feedbackEl.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        feedbackEl.className = 'contact-form-feedback error';
        feedbackEl.style.display = 'block';
        return;
      }

      var lines = [
        'Olá Lucas, quero um orçamento.',
        name ? 'Nome: ' + name : '',
        whatsapp ? 'WhatsApp: ' + whatsapp : '',
        typeLabel && typeSel.value ? 'Tipo: ' + typeLabel : '',
        '',
        message ? 'Mensagem:\n' + message.slice(0, 800) : '',
      ].filter(Boolean);

      var url = 'https://wa.me/' + P.WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));

      feedbackEl.textContent = 'Redirecionando para o WhatsApp com os dados da sua solicitação...';
      feedbackEl.className = 'contact-form-feedback success';
      feedbackEl.style.display = 'block';

      window.open(url, '_blank', 'noopener');
    });
  }

  function setupMiniContactForm() {
    var miniForm = document.querySelector('.mini-contact-form');
    if (!miniForm) return;

    var miniFeedback = document.createElement('div');
    miniFeedback.className = 'mini-form-feedback';
    miniFeedback.style.display = 'none';
    miniFeedback.setAttribute('role', 'status');
    miniForm.appendChild(miniFeedback);

    miniForm.addEventListener('submit', function (e) {
      e.preventDefault();
      miniFeedback.textContent = 'Demonstração: este formulário é uma prévia do seu futuro site. Para enviar seu orçamento real com os recursos configurados, utilize o botão "SOLICITAR NO WHATSAPP" logo abaixo ou o formulário oficial ao final da página.';
      miniFeedback.style.display = 'block';
    });
  }

  function setupAI() {
    var btn = document.getElementById('ai-suggest-btn');
    var input = document.getElementById('ai-description');
    var out = document.getElementById('ai-result');
    if (!btn || !input) return;

    btn.addEventListener('click', function () {
      var raw = input.value;
      if (!raw.trim()) {
        if (out) out.textContent = 'Descreva o projeto para eu sugerir um ponto de partida.';
        return;
      }
      var res = P.suggestFromText(raw);
      applyStateToUI(res.state);
      if (out) out.textContent = res.rationale || 'Sugestão aplicada no configurador.';
      render();
    });
  }

  function setupMenu() {
    var toggle = document.querySelector('.mobile-menu-toggle');
    var header = document.querySelector('.header');
    var nav = document.querySelector('.nav-links');
    if (!toggle || !header || !nav) return;

    function close() {
      header.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    }

    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });
  }

  setupButtons();
  setupSlider();
  setupWhatsApp();
  setupAI();
  setupContactForm();
  setupMiniContactForm();
  setupMenu();
  render();
})();
