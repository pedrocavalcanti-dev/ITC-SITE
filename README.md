# ITC — Instituto Tecnológico Campineiro

Site institucional do Projeto Integrador UC16, SENAC Campinas. Projeto educacional em HTML5, CSS3 e JavaScript vanilla: sem backend, instalação de pacotes ou build.

## Executar localmente

Na pasta do projeto:

```sh
python -m http.server 5500
```

Abra **http://localhost:5500**. Para encerrar o servidor, use Ctrl+C.

## Páginas

- `index.html`: apresentação completa, áreas, estrutura e MoonShield.
- `sobre.html`: contexto institucional, missão, visão e pilares.
- `estrutura.html`: dois pavimentos com visualização ampliada.
- `areas.html`: seis ambientes tecnológicos.
- `tecnologia.html`: infraestrutura digital, diagrama e MoonShield.
- `contato.html`: contexto do projeto e formulário demonstrativo.
- `404.html`: página para caminhos inexistentes.

O conteúdo está diretamente nos arquivos HTML e funciona sem montagem por JavaScript. Cabeçalho e rodapé são idênticos entre as páginas, com o item ativo correspondente. Ao alterar a navegação, atualize os sete HTMLs. Estilos e comportamentos são compartilhados em `assets/css/style.css` e `assets/js/main.js`.

## Imagens

Adicione os arquivos abaixo em `assets/img/` e recarregue a página. O JavaScript ativa automaticamente as imagens disponíveis. Não é necessário alterar o HTML.

| Arquivo | Uso |
| --- | --- |
| `hero-campus.jpg` | Imagem principal, preferencialmente vertical |
| `campus-about.jpg` | Apresentação do campus |
| `planta-terreo.png` ou `.jpg` | Planta do térreo |
| `planta-segundo-andar.png` ou `.jpg` | Planta do segundo andar |
| `lab-ti.jpg` | Tecnologia da Informação |
| `lab-redes.jpg` | Redes de Computadores |
| `lab-hardware.jpg` | Hardware |
| `lab-programacao.jpg` | Programação |
| `lab-cyber.jpg` | Cyber Security |
| `projetos.jpg` | Projetos e Inovação |

Nas plantas, PNG tem prioridade sobre JPG. Imagens de campus usam recorte proporcional; plantas aparecem integralmente. Otimize as imagens antes de adicioná-las (aproximadamente 1600 px para fotografias; preserve a legibilidade das plantas).

Sem imagens, o site exibe composições arquitetônicas feitas em CSS e esquemas conceituais identificados como sem escala. Esses desenhos não são plantas oficiais. Nenhuma fotografia das referências foi copiada. O carregamento opcional pode registrar respostas HTTP 404 na aba de rede enquanto os arquivos ainda não existirem; isso é tratado pelo código e não produz imagem quebrada.

## Identidade e edição

As cores ficam na seção `02 VARIABLES` do CSS. Inter é usada para textos e Manrope para títulos, carregadas por Google Fonts, com fallback local em Arial/sans-serif. O layout funciona sem acesso às fontes externas.

A marca textual está nos links `.brand`. Para substituir, adicione `assets/img/logo-itc.svg` ou `.png` e troque seu conteúdo por uma imagem com texto alternativo e dimensões explícitas em cada página. O favicon existente é `assets/icons/favicon.svg`.

## Interações e acessibilidade

- Menu mobile operável por teclado, com estado expandido e fechamento por Esc.
- Lightbox nativo com foco contido, fechamento por Esc, botão ou clique fora e devolução de foco ao acionador.
- Foco visível, atalho para conteúdo, navegação ativa e hierarquia de títulos.
- Animações discretas, desativadas por `prefers-reduced-motion`.
- Formulário com validação nativa, confirmação em texto e toast. Não envia nem armazena dados. Requer JavaScript para a demonstração.

## Publicar no Netlify

Importe o repositório ou arraste a pasta do site para o deploy manual do Netlify. Use a raiz (`.`) como diretório de publicação e deixe o comando de build vazio. `netlify.toml` já configura a publicação e os headers de segurança. Não existe redirecionamento de SPA; os links apontam para arquivos `.html`. O Netlify usa `404.html` para URLs inexistentes.

Nenhum domínio, contato real, estatística acadêmica ou oferta de curso foi presumido. O site não foi publicado automaticamente.

## Verificação realizada

As sete páginas foram verificadas no Chrome nas larguras de 1440, 1280, 1024, 768, 480 e 375 px, sem overflow horizontal ou exceções JavaScript. Foram conferidos links e âncoras locais, menu mobile, fechamento por Esc, retorno de foco do lightbox, plantas reais, formulário demonstrativo e movimento reduzido. O envio permanece desabilitado quando JavaScript está desligado.
