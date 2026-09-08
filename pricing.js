/**
 * Precificação central — altere só este arquivo.
 * Valores em reais. O site mostra ESTIMATIVA, nunca preço fechado.
 *
 * Faixas-alvo:
 *   Básico        R$ 150–250
 *   Profissional  R$ 250–350
 *   Avançado      R$ 350–750+
 */
(function (root) {
  const TYPES = {
    landing: {
      id: "landing",
      name: "Landing page",
      blurb: "Uma página. Oferta clara, contato direto.",
      range: "R$ 150–250",
      base: 170,
    },
    profissional: {
      id: "profissional",
      name: "Site profissional",
      blurb: "Várias páginas, presença comercial completa.",
      range: "R$ 250–350",
      base: 260,
    },
    avancado: {
      id: "avancado",
      name: "Site avançado",
      blurb: "Como o da Veronica: páginas, agenda, admin.",
      range: "R$ 350–750+",
      base: 390,
    },
    sistema: {
      id: "sistema",
      name: "Sistema web",
      blurb: "Login, cadastro, painel e regras do seu negócio.",
      range: "A partir de R$ 500",
      base: 540,
    },
    loja: {
      id: "loja",
      name: "Loja virtual",
      blurb: "Catálogo, pedido e canal de pagamento.",
      range: "R$ 350–750+",
      base: 390,
    },
    agendamento: {
      id: "agendamento",
      name: "Agendamento",
      blurb: "Agenda online, confirmação e painel de horários.",
      range: "R$ 350–750+",
      base: 390,
    },
    personalizado: {
      id: "personalizado",
      name: "Personalizado",
      blurb: "Escopo sob medida, combinado no WhatsApp.",
      range: "A partir de R$ 500",
      base: 540,
    },
  };

  const PAGES = {
    home: { name: "Home", price: 0, included: true },
    sobre: { name: "Sobre", price: 20 },
    servicos: { name: "Serviços", price: 22 },
    contato: { name: "Contato", price: 15 },
    blog: { name: "Blog", price: 45 },
    faq: { name: "FAQ", price: 18 },
    galeria: { name: "Galeria", price: 22 },
    depoimentos: { name: "Depoimentos", price: 18 },
  };

  const FEATURES = {
    whatsapp: { name: "Botão WhatsApp", price: 18 },
    formulario: { name: "Formulário", price: 22 },
    agendamento: { name: "Agendamento", price: 85 },
    login: { name: "Login", price: 55 },
    cadastro: { name: "Cadastro", price: 40 },
    admin: { name: "Área administrativa", price: 95 },
    dashboard: { name: "Dashboard", price: 80 },
    database: { name: "Banco de dados", price: 55 },
    responsivo: { name: "Responsividade", price: 0, included: true },
    seo: { name: "SEO", price: 28 },
    animacoes: { name: "Animações", price: 32 },
    pwa: { name: "PWA", price: 45 },
  };

  const INTEGRATIONS = {
    whatsappApi: { name: "WhatsApp (API)", price: 40 },
    email: { name: "E-mail", price: 18 },
    api: { name: "API externa", price: 50 },
    maps: { name: "Google Maps", price: 15 },
    pagamento: { name: "Pagamento", price: 80 },
    crm: { name: "CRM", price: 70 },
    automacao: { name: "Automação", price: 55 },
  };

  const IA = {
    chatbot: { name: "Chatbot", price: 90 },
    atendimento: { name: "Atendimento com IA", price: 120 },
    agente: { name: "Agente de IA", price: 180 },
    conteudo: { name: "Geração de conteúdo", price: 70 },
    autoIa: { name: "Automação inteligente", price: 100 },
  };

  const AUTOMATION = {
    n8n: { name: "n8n", price: 80 },
    fluxos: { name: "Fluxos automatizados", price: 65 },
    notificacoes: { name: "Notificações", price: 22 },
    processos: { name: "Processos automáticos", price: 55 },
  };

  const EXTRAS = {
    suporte: { name: "Suporte mensal", price: 40, note: "por mês" },
    treinamento: { name: "Treinamento", price: 50 },
    docs: { name: "Documentação", price: 28 },
  };

  const CATALOG = {
    pages: PAGES,
    features: FEATURES,
    integrations: INTEGRATIONS,
    ia: IA,
    automation: AUTOMATION,
    extras: EXTRAS,
  };

  function emptyState() {
    return {
      type: null,
      pages: [],
      features: [],
      integrations: [],
      ia: [],
      automation: [],
      extras: [],
      name: "",
      notes: "",
    };
  }

  function sumGroup(group, ids) {
    return (ids || []).reduce((acc, id) => acc + (group[id] ? group[id].price : 0), 0);
  }

  function selectedNames(group, ids) {
    return (ids || [])
      .map((id) => (group[id] ? group[id].name : null))
      .filter(Boolean);
  }

  function complexityOf(state, total) {
    const extrasCount =
      (state.pages || []).length +
      (state.features || []).length +
      (state.integrations || []).length +
      (state.ia || []).length +
      (state.automation || []).length +
      (state.extras || []).length;

    let score = extrasCount;
    if (state.type === "avancado" || state.type === "loja" || state.type === "agendamento") score += 3;
    if (state.type === "sistema" || state.type === "personalizado") score += 5;
    if ((state.features || []).includes("agendamento")) score += 2;
    if ((state.features || []).includes("admin")) score += 2;
    if ((state.ia || []).length) score += 2;

    if (!state.type) return { level: 0, label: "—", fill: 0 };
    if (score <= 4 || total < 230) return { level: 1, label: "Projeto simples", fill: 25 };
    if (score <= 8 || total < 360) return { level: 2, label: "Projeto profissional", fill: 50 };
    if (score <= 14 || total < 620) return { level: 3, label: "Projeto avançado", fill: 75 };
    return { level: 4, label: "Sob medida", fill: 100 };
  }

  function calculate(state) {
    if (!state || !state.type || !TYPES[state.type]) {
      return {
        total: 0,
        min: 0,
        max: 0,
        complexity: complexityOf(state || {}, 0),
        lines: [],
      };
    }

    const type = TYPES[state.type];
    let total = type.base;
    const lines = [{ label: type.name, price: type.base }];

    const groups = [
      ["pages", PAGES],
      ["features", FEATURES],
      ["integrations", INTEGRATIONS],
      ["ia", IA],
      ["automation", AUTOMATION],
      ["extras", EXTRAS],
    ];

    groups.forEach(([key, group]) => {
      (state[key] || []).forEach((id) => {
        const item = group[id];
        if (!item || !item.price) return;
        total += item.price;
        lines.push({ label: item.name, price: item.price, note: item.note });
      });
    });

    const min = Math.round(total * 0.9);
    const max = Math.round(total * 1.15);

    return {
      total: Math.round(total),
      min,
      max,
      complexity: complexityOf(state, total),
      lines,
    };
  }

  function suggestFromText(raw) {
    const t = String(raw || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

    const state = emptyState();
    state.pages = ["home", "contato"];
    state.features = ["whatsapp"];
    state.type = "profissional";

    const isClinic =
      /clinic|consultorio|psicolog|medico|dentista|estetica|salao|barbearia|agenda|consulta|paciente|cliente marcar/.test(
        t
      );
    const isShop = /loja|venda|ecommerce|pagamento|produto|catalogo/.test(t);
    const isPortfolio = /portfolio|curriculo|currículo|pessoal|fotografo/.test(t);
    const isSystem = /sistema|login|cadastro|painel|admin|dashboard|banco de dados/.test(t);
    const wantsIa = /ia\b|chatbot|agente|atendimento inteligente|openai|gpt/.test(t);
    const wantsAuto = /n8n|automat|notific|whatsapp.*confirm/.test(t);

    if (isPortfolio && !isClinic && !isShop) {
      state.type = "landing";
      state.pages = ["home", "sobre", "contato"];
    }

    if (isClinic) {
      state.type = "avancado";
      state.pages = ["home", "sobre", "servicos", "contato", "depoimentos"];
      state.features = ["whatsapp", "formulario", "agendamento"];
      state.integrations = ["whatsappApi"];
      state.automation = ["notificacoes"];
    }

    if (isShop) {
      state.type = "loja";
      state.pages = ["home", "servicos", "contato"];
      state.features = ["whatsapp", "formulario"];
      state.integrations = ["pagamento", "email"];
    }

    if (isSystem) {
      state.type = "sistema";
      state.pages = ["home", "contato"];
      state.features = ["login", "cadastro", "admin", "database"];
    }

    if (/blog/.test(t) && !state.pages.includes("blog")) state.pages.push("blog");
    if (/faq|perguntas/.test(t) && !state.pages.includes("faq")) state.pages.push("faq");
    if (/galeria|fotos/.test(t) && !state.pages.includes("galeria")) state.pages.push("galeria");
    if (/mapa|localizacao|endereco/.test(t) && !state.integrations.includes("maps")) {
      state.integrations.push("maps");
    }
    if (/formulario|orcamento|contato/.test(t) && !state.features.includes("formulario")) {
      state.features.push("formulario");
    }

    if (wantsIa) {
      if (/agente/.test(t)) state.ia.push("agente");
      else if (/atendimento/.test(t)) state.ia.push("atendimento");
      else state.ia.push("chatbot");
    }

    if (wantsAuto) {
      if (/n8n/.test(t)) state.automation.push("n8n");
      if (/notific|confirm/.test(t) && !state.automation.includes("notificacoes")) {
        state.automation.push("notificacoes");
      }
      if (/fluxo|automat/.test(t) && !state.automation.includes("fluxos")) {
        state.automation.push("fluxos");
      }
    }

    const estimate = calculate(state);
    return {
      state,
      estimate,
      rationale: buildRationale(state, t),
    };
  }

  function buildRationale(state, t) {
    const typeName = TYPES[state.type] ? TYPES[state.type].name : "projeto";
    const bits = [];
    bits.push("Sugestão: " + typeName + ".");
    if ((state.features || []).includes("agendamento")) {
      bits.push("Incluí agendamento porque o texto fala em marcar horário.");
    }
    if ((state.integrations || []).includes("whatsappApi") || (state.features || []).includes("whatsapp")) {
      bits.push("WhatsApp entra como canal de confirmação e contato.");
    }
    if ((state.ia || []).length) bits.push("Há espaço para uma camada de IA no atendimento.");
    if (!t.trim()) bits.push("Descreva o projeto para eu afinar a sugestão.");
    return bits.join(" ");
  }

  function formatBRL(value) {
    return Number(value || 0).toLocaleString("pt-BR");
  }

  function formatRange(min, max) {
    if (!min && !max) return "R$ 0";
    if (min === max) return "R$ " + formatBRL(min);
    return "R$ " + formatBRL(min) + " – " + formatBRL(max);
  }

  function buildWhatsAppMessage(state, estimate) {
    const type = state.type && TYPES[state.type] ? TYPES[state.type].name : "A definir";
    const lines = [];
    lines.push("Olá Lucas, quero um orçamento.");
    if (state.name) lines.push("Nome: " + state.name.trim());
    lines.push("");
    lines.push("Tipo: " + type);

    const groups = [
      ["Páginas", PAGES, state.pages],
      ["Funcionalidades", FEATURES, state.features],
      ["Integrações", INTEGRATIONS, state.integrations],
      ["IA", IA, state.ia],
      ["Automação", AUTOMATION, state.automation],
      ["Extras", EXTRAS, state.extras],
    ];

    groups.forEach(([label, group, ids]) => {
      const names = selectedNames(group, ids);
      if (names.length) lines.push(label + ": " + names.join(", "));
    });

    if (estimate && estimate.total) {
      lines.push("");
      lines.push("Estimativa no site: " + formatRange(estimate.min, estimate.max));
      lines.push("(valores aproximados — o preço final depende do escopo)");
    }

    if (state.notes && state.notes.trim()) {
      lines.push("");
      lines.push("Descrição:");
      lines.push(state.notes.trim().slice(0, 800));
    }

    return lines.join("\n");
  }

  root.LUCAS_PRICING = {
    TYPES,
    CATALOG,
    PAGES,
    FEATURES,
    INTEGRATIONS,
    IA,
    AUTOMATION,
    EXTRAS,
    emptyState,
    calculate,
    suggestFromText,
    formatBRL,
    formatRange,
    buildWhatsAppMessage,
    selectedNames,
    WHATSAPP: "5531973403545",
  };
})(typeof window !== "undefined" ? window : globalThis);
