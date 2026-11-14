# Lucas Dev — Sites, Sistemas e Soluções Digitais

Landing page responsiva para apresentar serviços de desenvolvimento web, projetos demonstrativos e um configurador interativo de orçamento.

## Tecnologias

- HTML5 semântico;
- CSS3, incluindo layout responsivo, animações e suporte a movimento reduzido;
- JavaScript puro, sem framework, etapa de build ou dependência de runtime;
- Google Fonts carregadas pela rede (Inter, Space Grotesk e JetBrains Mono).

## Funcionalidades

- seções de serviços, processo, portfólio, orçamento e contato;
- navegação responsiva com menu mobile;
- configurador com sete tipos de projeto, páginas, recursos, integrações, IA, automações e adicionais;
- cálculo de estimativa, slider de faixa, resumo e prévia visual progressiva do projeto;
- sugestões locais de estrutura baseadas na descrição do projeto, sem chamada a uma API de IA;
- formulário de contato com validação e composição de uma mensagem para abrir no WhatsApp;
- formulário do mini-site apenas demonstrativo: exibe orientação na página e não envia os dados;
- efeitos de entrada ao rolar e parallax do hero em dispositivos desktop que não solicitam movimento reduzido.

Os valores são estimativas não vinculantes. Os previews de sites e sistemas são ilustrativos. O projeto Verônica não foi reativado e não possui link funcional para uma página externa.

## Como executar

Não há instalação de dependências. Na pasta do projeto, inicie um servidor estático:

```powershell
python -m http.server 8000
```

Abra <http://127.0.0.1:8000/> no navegador. Encerre o servidor com `Ctrl+C` no terminal em que ele está rodando.

## Testes disponíveis

```powershell
node scripts/pricing-test.js
node --check app.js
node --check animations.js
node --check pricing.js
```

O script `scripts/pricing-test.js` cobre os casos básicos de cálculo e mensagem de orçamento. Os demais comandos verificam sintaxe JavaScript.

## Estrutura

- `index.html` — conteúdo e estrutura da página;
- `styles.css` — tokens visuais, componentes e breakpoints responsivos;
- `app.js` — estado do configurador, formulários, navegação e integração com WhatsApp;
- `pricing.js` — regras de estimativa e sugestões baseadas em texto;
- `animations.js` — rolagem, revelação por IntersectionObserver e parallax;
- `imagens/` — imagens e favicon;
- `scripts/` — teste de preços e utilitário de otimização de imagem.

## Demonstração e contato

Demonstração pública: [japapaz696.github.io/Lucas](https://japapaz696.github.io/Lucas/). A página, a imagem de compartilhamento e o favicon responderam HTTP 200 em 13 de novembro de 2026.

Contatos exibidos no site: WhatsApp +55 31 97340-3545 e e-mail <lucaspaz696@gmail.com>. Confirme disponibilidade e valores diretamente com o responsável.

O repositório continua em `Japapaz696/Lucas`; uma possível renomeação para `lucas-dev` permanece como decisão manual, pois poderia alterar URLs existentes.

## Autor

[Lucas Santana da Paz](https://github.com/Japapaz696)
