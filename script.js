document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector(".nav-list");
  const header = document.querySelector(".header");

  const linksInternos = document.querySelectorAll('a[href^="#"]');

  const linksNavegacao = navList
    ? navList.querySelectorAll('a[href^="#"]')
    : [];

  // =========================================================
  // MENU MOBILE
  // =========================================================

  function menuEstaAberto() {
    return menuToggle
      ? menuToggle.getAttribute("aria-expanded") === "true"
      : false;
  }

  function abrirMenu() {
    if (!menuToggle || !navList) {
      return;
    }

    navList.style.display = "flex";

    menuToggle.setAttribute("aria-expanded", "true");

    menuToggle.setAttribute("aria-label", "Fechar menu de navegação");
  }

  function fecharMenu() {
    if (!menuToggle || !navList) {
      return;
    }

    if (window.innerWidth <= 768) {
      navList.style.display = "none";
    } else {
      navList.style.removeProperty("display");
    }

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "Abrir menu de navegação");
  }

  if (menuToggle && navList) {
    menuToggle.addEventListener("click", function () {
      if (menuEstaAberto()) {
        fecharMenu();
      } else {
        abrirMenu();
      }
    });

    // Fecha o menu mobile depois de selecionar um link
    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          fecharMenu();
        }
      });
    });

    // Corrige o estado do menu quando a tela muda de tamanho
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        navList.style.removeProperty("display");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute("aria-label", "Abrir menu de navegação");
      } else if (!menuEstaAberto()) {
        navList.style.display = "none";
      }
    });
  }

  // =========================================================
  // ROLAGEM SUAVE
  // =========================================================

  linksInternos.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const destinoId = link.getAttribute("href");

      if (!destinoId || destinoId === "#") {
        return;
      }

      let destino;

      try {
        destino = document.querySelector(destinoId);
      } catch (erro) {
        return;
      }

      if (!destino) {
        return;
      }

      event.preventDefault();

      const alturaHeader = header ? header.offsetHeight : 0;

      const posicaoDestino =
        destino.getBoundingClientRect().top + window.pageYOffset - alturaHeader;

      window.scrollTo({
        top: posicaoDestino,
        behavior: "smooth",
      });
    });
  });

  // =========================================================
  // ITEM ATIVO DO MENU
  // =========================================================

  const secoesNavegacao = [];

  linksNavegacao.forEach(function (link) {
    const id = link.getAttribute("href");

    if (!id || !id.startsWith("#")) {
      return;
    }

    let secao;

    try {
      secao = document.querySelector(id);
    } catch (erro) {
      return;
    }

    if (secao) {
      secoesNavegacao.push({
        secao: secao,
        link: link,
      });
    }
  });

  function atualizarNavegacaoAtiva() {
    if (!secoesNavegacao.length) {
      return;
    }

    const alturaHeader = header ? header.offsetHeight : 0;

    const pontoReferencia =
      window.scrollY + alturaHeader + window.innerHeight * 0.2;

    let itemAtual = secoesNavegacao[0];

    secoesNavegacao.forEach(function (item) {
      if (item.secao.offsetTop <= pontoReferencia) {
        itemAtual = item;
      }
    });

    linksNavegacao.forEach(function (link) {
      link.removeAttribute("aria-current");

      link.style.removeProperty("color");
      link.style.removeProperty("font-weight");
    });

    if (itemAtual && itemAtual.link) {
      itemAtual.link.setAttribute("aria-current", "page");

      itemAtual.link.style.color = "var(--verde-principal)";

      itemAtual.link.style.fontWeight = "700";
    }
  }

  if (secoesNavegacao.length) {
    atualizarNavegacaoAtiva();

    window.addEventListener("scroll", atualizarNavegacaoAtiva, {
      passive: true,
    });

    window.addEventListener("resize", atualizarNavegacaoAtiva);
  }

  // =========================================================
  // AOS 2.3.1
  // =========================================================

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      easing: "ease-out",
      once: true,
      offset: 80,
    });
  }
});
