document.addEventListener('DOMContentLoaded', function () {

  var WHATSAPP_NUM = '5581983911126';

  // --- Loader ---
  var loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('hidden');
    }, 2000);
  });
  setTimeout(function () {
    loader.classList.add('hidden');
  }, 3500);

  // --- Navbar scroll effect ---
  var navbar = document.getElementById('navbar');
  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // --- Scroll lock (iOS-safe) ---
  var scrollLockY = 0;
  function lockScroll() {
    scrollLockY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollLockY + 'px';
    document.body.style.width = '100%';
  }
  function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollLockY);
  }

  // --- Mobile menu ---
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    if (navMenu.classList.contains('active')) { lockScroll(); } else { unlockScroll(); }
  }

  function closeMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    unlockScroll();
    document.querySelectorAll('.nav-dropdown.open').forEach(function(d) {
      d.classList.remove('open');
    });
  }

  navToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function(e) {
      var parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown && window.innerWidth <= 768) {
        e.preventDefault();
        e.stopImmediatePropagation();
        parentDropdown.classList.toggle('open');
      } else {
        closeMenu();
      }
    });
  });

  // --- Scroll reveal for product cards ---
  function revealCards() {
    var cards = document.querySelectorAll('.product-card:not(.hidden)');
    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        card.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', revealCards);
  revealCards();

  // --- Toast ---
  function showToast(msg) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2500);
  }

  // --- Hero background slider (respects prefers-reduced-motion) ---
  var heroSlides = document.querySelectorAll('.hero-bg-slide');
  if (heroSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var currentSlide = 0;
    setInterval(function () {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 4000);
  }

  // --- Stats counter animation ---
  var statNumbers = document.querySelectorAll('.stat-number');
  var statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    var statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    var rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      statsAnimated = true;
      statNumbers.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var duration = 2000;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target.toLocaleString('pt-BR');
          }
        }
        requestAnimationFrame(step);
      });
    }
  }
  window.addEventListener('scroll', animateStats);
  animateStats();

  // --- Carousel ---
  var track = document.getElementById('carouselTrack');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');

  if (track && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -260, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: 260, behavior: 'smooth' });
    });
  }

  // --- Medidas tabs ---
  var infoTabs = document.querySelectorAll('.info-tab');
  infoTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetId = this.getAttribute('data-tab');
      infoTabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      document.querySelectorAll('.info-tab-content').forEach(function (content) {
        content.classList.remove('active');
      });
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- Religiosos filter (shared function) ---
  var filterBtns = document.querySelectorAll('.filter-btn');
  var religGrid = document.getElementById('religiosos-grid');

  function applyReligFilter(filter) {
    filterBtns.forEach(function (b) {
      if (b.getAttribute('data-filter') === filter) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    var cards = religGrid.querySelectorAll('.product-card');
    var visibleIndex = 0;
    cards.forEach(function (card) {
      card.classList.remove('pop-in');
      var category = card.getAttribute('data-category');
      if (filter === 'todos' || category === filter) {
        card.classList.remove('hidden');
        var delay = visibleIndex * 55;
        visibleIndex++;
        (function (c, d) {
          setTimeout(function () {
            c.classList.add('pop-in');
            c.addEventListener('animationend', function () { c.classList.remove('pop-in'); }, { once: true });
          }, d);
        })(card, delay);
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });
  }

  // --- Dropdown filter links ---
  document.querySelectorAll('.nav-dropdown-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var filter = this.getAttribute('data-filter');
      closeMenu();
      applyReligFilter(filter);
      document.getElementById('religiosos').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyReligFilter(this.getAttribute('data-filter'));
    });
  });

  // --- Shopping Cart ---
  var cart = [];
  var freteAtual = 0;
  var cartCidadeUf = '';

  // Load persisted cart
  try {
    var stored = localStorage.getItem('smileCart');
    if (stored) cart = JSON.parse(stored);
  } catch (e) {}

  function saveCart() {
    try { localStorage.setItem('smileCart', JSON.stringify(cart)); } catch (e) {}
  }

  var cartSidebar = document.getElementById('cartSidebar');
  var cartOverlay = document.getElementById('cartOverlay');
  var cartItems = document.getElementById('cartItems');
  var cartEmpty = document.getElementById('cartEmpty');
  var cartFooter = document.getElementById('cartFooter');
  var cartCountEl = document.getElementById('cartCount');
  var cartTotalEl = document.getElementById('cartTotal');
  var cartSuccess = document.getElementById('cartSuccess');

  function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    lockScroll();
    renderCartRv();
  }

  function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    unlockScroll();
  }

  document.getElementById('cartToggle').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Cart success clear button
  document.getElementById('cartClearSuccess').addEventListener('click', function () {
    cart = [];
    freteAtual = 0;
    cartCidadeUf = '';
    saveCart();
    cartSuccess.style.display = 'none';
    cartItems.style.display = '';
    updateCartUI();
  });

  function updateCartUI() {
    var totalItems = 0;
    var totalPrice = 0;

    cart.forEach(function (item) {
      totalItems += item.qty;
      totalPrice += item.price * item.qty;
    });

    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
    saveCart();

    if (cart.length === 0) {
      cartEmpty.style.display = 'block';
      cartFooter.style.display = 'none';
      var oldItems = cartItems.querySelectorAll('.cart-item');
      oldItems.forEach(function (el) { el.remove(); });
      return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    updateCartTotals();

    var oldItems = cartItems.querySelectorAll('.cart-item');
    oldItems.forEach(function (el) { el.remove(); });

    cart.forEach(function (item, index) {
      var div = document.createElement('div');
      div.className = 'cart-item';

      var img = document.createElement('img');
      img.src = item.img;
      img.alt = item.name;
      img.className = 'cart-item-img';

      var details = document.createElement('div');
      details.className = 'cart-item-details';

      var nameEl = document.createElement('p');
      nameEl.className = 'cart-item-name';
      nameEl.textContent = item.name;

      var sizeEl = document.createElement('p');
      if (item.size) {
        sizeEl.className = 'cart-item-size';
        sizeEl.textContent = 'Tam: ' + item.size;
      } else {
        sizeEl.className = 'cart-item-size cart-item-size-missing';
        sizeEl.textContent = 'Escolha um tamanho';
        sizeEl.dataset.name = item.name;
        sizeEl.dataset.price = item.price;
        sizeEl.dataset.img = item.img;
      }

      var priceEl = document.createElement('p');
      priceEl.className = 'cart-item-price';
      priceEl.textContent = 'R$ ' + (item.price * item.qty).toFixed(2).replace('.', ',');

      var qtyRow = document.createElement('div');
      qtyRow.className = 'cart-item-qty';

      var minusBtn = document.createElement('button');
      minusBtn.className = 'qty-minus';
      minusBtn.setAttribute('data-index', index);
      minusBtn.setAttribute('aria-label', 'Diminuir quantidade');
      minusBtn.textContent = '-';

      var qtySpan = document.createElement('span');
      qtySpan.textContent = item.qty;

      var plusBtn = document.createElement('button');
      plusBtn.className = 'qty-plus';
      plusBtn.setAttribute('data-index', index);
      plusBtn.setAttribute('aria-label', 'Aumentar quantidade');
      plusBtn.textContent = '+';

      qtyRow.appendChild(minusBtn);
      qtyRow.appendChild(qtySpan);
      qtyRow.appendChild(plusBtn);

      details.appendChild(nameEl);
      details.appendChild(sizeEl);
      details.appendChild(priceEl);
      details.appendChild(qtyRow);

      var removeBtn = document.createElement('button');
      removeBtn.className = 'cart-item-remove';
      removeBtn.setAttribute('data-index', index);
      removeBtn.setAttribute('aria-label', 'Remover item');
      removeBtn.textContent = '×';

      div.appendChild(img);
      div.appendChild(details);
      div.appendChild(removeBtn);
      cartItems.appendChild(div);
    });

    cartItems.querySelectorAll('.qty-minus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(this.getAttribute('data-index'));
        if (cart[i].qty > 1) { cart[i].qty--; } else { cart.splice(i, 1); }
        updateCartUI();
      });
    });

    cartItems.querySelectorAll('.qty-plus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(this.getAttribute('data-index'));
        cart[i].qty++;
        updateCartUI();
      });
    });

    cartItems.querySelectorAll('.cart-item-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(this.getAttribute('data-index'));
        cart.splice(i, 1);
        updateCartUI();
      });
    });

    cartItems.querySelectorAll('.cart-item-size-missing').forEach(function (el) {
      el.addEventListener('click', function () {
        var name = this.dataset.name;
        var price = parseFloat(this.dataset.price);
        var img = this.dataset.img;
        pendingCartFixName = name;
        closeCart();
        openProductModal(name, price, img);
      });
    });
  }

  // --- Product Modal ---
  var productModal = document.getElementById('productModal');
  var modalQty = 1;
  var modalProduct = {};
  var pendingCartFixName = null;

  var productDescriptions = {
    'bolsa': 'Bolsa artesanal feita com cristais de alta qualidade. Perfeita para festas e eventos especiais.',
    'pulseira': 'Pulseira artesanal feita com miçangas selecionadas. Ideal para presentear ou usar no dia a dia.',
    'colar': 'Colar artesanal com pingente exclusivo. Feito à mão com materiais de qualidade.',
    'tornozeleira': 'Tornozeleira artesanal delicada, perfeita para o verão e looks despojados.',
    'body': 'Body chain artesanal de cristais. Ideal para looks de praia, piscina e festas.',
    'terco': 'Terço artesanal feito com cristais e detalhes em dourado. Ótimo para presente ou uso pessoal.',
    'chaveiro': 'Chaveiro religioso artesanal personalizado com cristais e pingentes dourados.',
  };

  var sizeOptions = {
    'pulseira': [
      { value: 'P (16-17cm)', label: 'P (16-17cm)' },
      { value: 'M (17-19cm)', label: 'M (17-19cm)' },
      { value: 'G (19-20cm)', label: 'G (19-20cm)' },
      { value: 'GG (20-21,5cm)', label: 'GG (20-21,5cm)' },
    ],
    'colar': [
      { value: '35cm - Gargantilha', label: '35cm - Gargantilha' },
      { value: '40cm - Princesa', label: '40cm - Princesa' },
      { value: '45cm - Matinê', label: '45cm - Matinê' },
      { value: '50cm - Médio', label: '50cm - Médio' },
    ],
    'tornozeleira': [
      { value: 'P (22-23cm)', label: 'P (22-23cm)' },
      { value: 'M (24-25cm)', label: 'M (24-25cm)' },
      { value: 'G (26-27cm)', label: 'G (26-27cm)' },
      { value: 'GG (28-29cm)', label: 'GG (28-29cm)' },
    ],
  };

  function getProductCategory(name) {
    var n = name.toLowerCase();
    if (n.indexOf('bolsa') !== -1) return 'bolsa';
    if (n.indexOf('pulseira') !== -1) return 'pulseira';
    if (n.indexOf('colar') !== -1) return 'colar';
    if (n.indexOf('tornozeleira') !== -1) return 'tornozeleira';
    if (n.indexOf('body') !== -1) return 'body';
    if (n.indexOf('terco') !== -1 || n.indexOf('terço') !== -1) return 'terco';
    if (n.indexOf('chaveiro') !== -1) return 'chaveiro';
    return 'bolsa';
  }

  var galleryImgs = [];
  var galleryIndex = 0;

  function renderGallery(imgs, name) {
    var track = document.getElementById('modalGalleryTrack');
    var dots = document.getElementById('modalGalleryDots');
    track.innerHTML = '';
    dots.innerHTML = '';
    galleryImgs = imgs;
    galleryIndex = 0;

    imgs.forEach(function (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = name;
      img.className = 'modal-gallery-img';
      track.appendChild(img);
    });

    var hasMultiple = imgs.length > 1;
    var prevBtn = document.getElementById('galleryPrev');
    var nextBtn = document.getElementById('galleryNext');
    prevBtn.style.display = hasMultiple ? '' : 'none';
    nextBtn.style.display = hasMultiple ? '' : 'none';

    if (hasMultiple) {
      imgs.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'modal-gallery-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.setAttribute('aria-label', 'Foto ' + (i + 1));
        dot.addEventListener('click', function () { goToSlide(parseInt(this.getAttribute('data-index'))); });
        dots.appendChild(dot);
      });
      dots.style.display = 'flex';
    } else {
      dots.style.display = 'none';
    }

    goToSlide(0);
  }

  function goToSlide(index) {
    galleryIndex = index;
    var track = document.getElementById('modalGalleryTrack');
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    document.querySelectorAll('.modal-gallery-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === index);
    });
    var prev = document.getElementById('galleryPrev');
    var next = document.getElementById('galleryNext');
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === galleryImgs.length - 1;
  }

  // Touch swipe on gallery
  (function () {
    var touchStartX = 0;
    var gallery = document.querySelector('.product-modal-gallery');
    gallery.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    gallery.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0 && galleryIndex < galleryImgs.length - 1) goToSlide(galleryIndex + 1);
        else if (diff < 0 && galleryIndex > 0) goToSlide(galleryIndex - 1);
      }
    }, { passive: true });
  })();

  // Prev/next arrow buttons
  document.getElementById('galleryPrev').addEventListener('click', function () {
    if (galleryIndex > 0) goToSlide(galleryIndex - 1);
  });
  document.getElementById('galleryNext').addEventListener('click', function () {
    if (galleryIndex < galleryImgs.length - 1) goToSlide(galleryIndex + 1);
  });

  function openProductModal(name, price, imgs) {
    if (!Array.isArray(imgs)) imgs = [imgs];
    modalQty = 1;
    var cat = getProductCategory(name);
    modalProduct = { name: name, price: price, img: imgs[0], category: cat };

    addToRecentlyViewed(name, price, imgs[0]);

    var shareBtn = document.getElementById('modalShareBtn');
    if (shareBtn) {
      var price2x = (price / 2).toFixed(2).replace('.', ',');
      var shareText = encodeURIComponent(
        '🌸 Vi esse produto na *Smile Aninha* e adorei!\n\n' +
        '✨ *' + name + '*\n' +
        '💰 *R$ ' + price.toFixed(2).replace('.', ',') + '* ou 2x de R$ ' + price2x + ' sem juros\n\n' +
        '🛍️ Confira no site: https://sitesmileaninha.vercel.app'
      );
      shareBtn.href = 'https://api.whatsapp.com/send?text=' + shareText;
    }

    renderGallery(imgs, name);
    document.getElementById('modalName').textContent = name;
    document.getElementById('modalPrice').textContent = 'R$ ' + price.toFixed(2).replace('.', ',');
    document.getElementById('modalDesc').textContent = productDescriptions[cat] || '';
    document.getElementById('modalQty').textContent = '1';

    var sizeGroup = document.getElementById('modalSizeGroup');
    var sizeOpts = document.getElementById('modalSizeOptions');
    if (sizeOptions[cat]) {
      sizeGroup.style.display = 'block';
      sizeOpts.innerHTML = '';
      sizeOptions[cat].forEach(function (opt) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'modal-size-btn';
        btn.setAttribute('data-size', opt.value);
        btn.textContent = opt.label;
        btn.addEventListener('click', function () {
          sizeOpts.querySelectorAll('.modal-size-btn').forEach(function (b) { b.classList.remove('active'); });
          this.classList.add('active');
          sizeOpts.classList.remove('size-required');
        });
        sizeOpts.appendChild(btn);
      });
    } else {
      sizeGroup.style.display = 'block';
      sizeOpts.innerHTML = '<button type="button" class="modal-size-btn active" data-size="Tamanho Único">Tamanho Único</button>';
    }

    document.querySelectorAll('.modal-accordion-content').forEach(function (c) { c.classList.remove('open'); });
    document.querySelectorAll('.modal-accordion-btn').forEach(function (b) {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    });
    document.getElementById('modalAddedMsg').textContent = '';
    document.getElementById('modalFreteResult').textContent = '';
    document.getElementById('modalCep').value = '';

    productModal.classList.add('active');
    lockScroll();
    history.pushState({ productModal: true }, '', '#produto=' + encodeURIComponent(name));
    productModal.querySelector('.product-modal-content').scrollTop = 0;
    document.getElementById('productModalBack').focus();
  }

  function closeProductModal() {
    productModal.classList.remove('active');
    unlockScroll();
    pendingCartFixName = null;
  }

  document.getElementById('productModalBack').addEventListener('click', function () {
    if (history.state && history.state.productModal) {
      history.back();
    } else {
      closeProductModal();
    }
  });

  window.addEventListener('popstate', function () {
    if (productModal.classList.contains('active')) {
      closeProductModal();
    }
  });

  document.getElementById('modalQtyMinus').addEventListener('click', function () {
    if (modalQty > 1) { modalQty--; document.getElementById('modalQty').textContent = modalQty; }
  });
  document.getElementById('modalQtyPlus').addEventListener('click', function () {
    if (modalQty < 10) { modalQty++; document.getElementById('modalQty').textContent = modalQty; }
  });

  var freteTabela = {
    'PE': { valor: 10.00, prazo: '3 a 5 dias úteis', regiao: 'Pernambuco' },
    'AL': { valor: 15.00, prazo: '5 a 8 dias úteis', regiao: 'Nordeste' },
    'BA': { valor: 15.00, prazo: '5 a 8 dias úteis', regiao: 'Nordeste' },
    'CE': { valor: 15.00, prazo: '5 a 8 dias úteis', regiao: 'Nordeste' },
    'MA': { valor: 18.00, prazo: '5 a 8 dias úteis', regiao: 'Nordeste' },
    'PB': { valor: 12.00, prazo: '4 a 6 dias úteis', regiao: 'Nordeste' },
    'PI': { valor: 18.00, prazo: '5 a 8 dias úteis', regiao: 'Nordeste' },
    'RN': { valor: 15.00, prazo: '5 a 8 dias úteis', regiao: 'Nordeste' },
    'SE': { valor: 15.00, prazo: '5 a 8 dias úteis', regiao: 'Nordeste' },
    'SP': { valor: 22.00, prazo: '7 a 12 dias úteis', regiao: 'Sudeste' },
    'RJ': { valor: 22.00, prazo: '7 a 12 dias úteis', regiao: 'Sudeste' },
    'MG': { valor: 20.00, prazo: '7 a 12 dias úteis', regiao: 'Sudeste' },
    'ES': { valor: 20.00, prazo: '7 a 12 dias úteis', regiao: 'Sudeste' },
    'PR': { valor: 25.00, prazo: '8 a 14 dias úteis', regiao: 'Sul' },
    'SC': { valor: 25.00, prazo: '8 a 14 dias úteis', regiao: 'Sul' },
    'RS': { valor: 28.00, prazo: '8 a 14 dias úteis', regiao: 'Sul' },
    'DF': { valor: 22.00, prazo: '7 a 12 dias úteis', regiao: 'Centro-Oeste' },
    'GO': { valor: 22.00, prazo: '7 a 12 dias úteis', regiao: 'Centro-Oeste' },
    'MT': { valor: 25.00, prazo: '8 a 14 dias úteis', regiao: 'Centro-Oeste' },
    'MS': { valor: 25.00, prazo: '8 a 14 dias úteis', regiao: 'Centro-Oeste' },
    'AC': { valor: 30.00, prazo: '10 a 18 dias úteis', regiao: 'Norte' },
    'AM': { valor: 30.00, prazo: '10 a 18 dias úteis', regiao: 'Norte' },
    'AP': { valor: 30.00, prazo: '10 a 18 dias úteis', regiao: 'Norte' },
    'PA': { valor: 28.00, prazo: '10 a 18 dias úteis', regiao: 'Norte' },
    'RO': { valor: 30.00, prazo: '10 a 18 dias úteis', regiao: 'Norte' },
    'RR': { valor: 30.00, prazo: '10 a 18 dias úteis', regiao: 'Norte' },
    'TO': { valor: 25.00, prazo: '8 a 14 dias úteis', regiao: 'Norte' },
  };

  function calcFreteResult(data, cepFormatted) {
    var uf = data.uf;
    var cidade = data.localidade;
    cartCidadeUf = cidade + ', ' + uf + ' - CEP ' + cepFormatted;
    var frete = freteTabela[uf];

    if (cidade && cidade.toLowerCase() === 'belo jardim' && uf === 'PE') {
      freteAtual = 5.00;
      return '<strong>' + cidade + ', ' + uf + '</strong> - R$ 5,00 (1 a 2 dias)';
    } else if (frete) {
      freteAtual = frete.valor;
      return '<strong>' + cidade + ', ' + uf + '</strong> - R$ ' + frete.valor.toFixed(2).replace('.', ',') + ' (' + frete.prazo + ')';
    } else {
      freteAtual = 25.00;
      return '<strong>' + cidade + ', ' + uf + '</strong> - R$ 25,00 (10 a 15 dias)';
    }
  }

  // --- Cart Frete ---
  document.getElementById('cartCalcFrete').addEventListener('click', function () {
    var cep = document.getElementById('cartCep').value.replace(/\D/g, '');
    var resultEl = document.getElementById('cartFreteResult');
    var btnEl = this;

    if (cep.length < 8) {
      resultEl.textContent = 'Digite um CEP válido (8 dígitos)';
      freteAtual = 0;
      cartCidadeUf = '';
      updateCartTotals();
      return;
    }

    btnEl.textContent = 'Calculando...';
    resultEl.textContent = '';

    fetch('https://viacep.com.br/ws/' + cep + '/json/')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        btnEl.textContent = 'Calcular';
        if (data.erro) {
          resultEl.textContent = 'CEP não encontrado. Verifique e tente novamente.';
          freteAtual = 0;
          cartCidadeUf = '';
          updateCartTotals();
          return;
        }
        resultEl.innerHTML = calcFreteResult(data, document.getElementById('cartCep').value);
        updateCartTotals();
        updateCashWarning();
      })
      .catch(function () {
        btnEl.textContent = 'Calcular';
        resultEl.textContent = 'Erro ao consultar o CEP. Tente novamente.';
        freteAtual = 0;
        cartCidadeUf = '';
        updateCartTotals();
      });
  });

  document.getElementById('cartCep').addEventListener('input', function () {
    var v = this.value.replace(/\D/g, '');
    if (v.length > 5) { this.value = v.slice(0, 5) + '-' + v.slice(5, 8); }
    else { this.value = v; }
    var btn = document.getElementById('cartCalcFrete');
    if (v.length >= 8) {
      btn.classList.add('ready');
      btn.click();
    } else {
      btn.classList.remove('ready');
    }
  });

  function updateCartTotals() {
    var subtotal = 0;
    cart.forEach(function (item) { subtotal += item.price * item.qty; });

    document.getElementById('cartSubtotal').textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');

    var freteLine = document.getElementById('cartFreteLine');
    if (freteAtual > 0) {
      freteLine.style.display = 'flex';
      document.getElementById('cartFreteValue').textContent = 'R$ ' + freteAtual.toFixed(2).replace('.', ',');
    } else {
      freteLine.style.display = 'none';
    }

    var total = subtotal + freteAtual;
    cartTotalEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
  }

  function addModalToCart() {
    var activeSize = document.querySelector('.modal-size-btn.active');
    var size = activeSize ? activeSize.getAttribute('data-size') : null;

    // Remove o item sem tamanho se o modal foi aberto pelo "Escolha um tamanho" do carrinho
    if (pendingCartFixName) {
      cart = cart.filter(function (item) {
        return !(item.name === pendingCartFixName && item.size === null);
      });
      pendingCartFixName = null;
    }

    var existing = cart.find(function (item) {
      return item.name === modalProduct.name && item.size === size;
    });

    if (existing) {
      existing.qty += modalQty;
    } else {
      cart.push({
        name: modalProduct.name,
        price: modalProduct.price,
        img: modalProduct.img,
        size: size,
        qty: modalQty
      });
    }

    cartCountEl.classList.add('bump');
    setTimeout(function () { cartCountEl.classList.remove('bump'); }, 300);
    updateCartUI();
    return true;
  }

  document.getElementById('modalAddCart').addEventListener('click', function () {
    if (addModalToCart()) {
      document.getElementById('modalAddedMsg').textContent = 'Adicionado ao carrinho!';
      setTimeout(function () {
        closeProductModal();
        showToast('Produto adicionado ao carrinho!');
      }, 600);
    }
  });

  document.getElementById('modalBuyNow').addEventListener('click', function () {
    var cat = modalProduct.category;
    if (sizeOptions[cat]) {
      var activeSize = document.querySelector('.modal-size-btn.active');
      if (!activeSize) {
        var sizeOpts = document.getElementById('modalSizeOptions');
        sizeOpts.classList.add('size-required');
        sizeOpts.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(function () { sizeOpts.classList.remove('size-required'); }, 900);
        return;
      }
    }
    if (addModalToCart()) {
      closeProductModal();
      openCart();
    }
  });

  // --- Accordions ---
  document.querySelectorAll('.modal-accordion-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = this.getAttribute('data-target');
      var content = document.getElementById(targetId);
      this.classList.toggle('open');
      content.classList.toggle('open');
      this.setAttribute('aria-expanded', this.classList.contains('open') ? 'true' : 'false');
    });
  });

  // --- Modal CEP (syncs frete to cart) ---
  document.getElementById('modalCalcFrete').addEventListener('click', function () {
    var cep = document.getElementById('modalCep').value.replace(/\D/g, '');
    var resultEl = document.getElementById('modalFreteResult');
    var btnEl = this;

    if (cep.length < 8) {
      resultEl.textContent = 'Digite um CEP válido (8 dígitos)';
      return;
    }

    btnEl.textContent = 'Calculando...';

    fetch('https://viacep.com.br/ws/' + cep + '/json/')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        btnEl.textContent = 'Calcular';
        if (data.erro) {
          resultEl.textContent = 'CEP não encontrado.';
          return;
        }
        var cepFormatted = document.getElementById('modalCep').value;
        resultEl.innerHTML = calcFreteResult(data, cepFormatted);
        // Sync to cart CEP input
        var cartCepInput = document.getElementById('cartCep');
        if (cartCepInput) {
          cartCepInput.value = cepFormatted;
          document.getElementById('cartFreteResult').innerHTML = resultEl.innerHTML;
          updateCartTotals();
        }
      })
      .catch(function () {
        btnEl.textContent = 'Calcular';
        resultEl.textContent = 'Erro ao consultar. Tente novamente.';
      });
  });

  document.getElementById('modalCep').addEventListener('input', function () {
    var v = this.value.replace(/\D/g, '');
    if (v.length > 5) { this.value = v.slice(0, 5) + '-' + v.slice(5, 8); }
    else { this.value = v; }
    var btn = document.getElementById('modalCalcFrete');
    if (v.length >= 8) {
      btn.classList.add('ready');
      btn.click();
    } else {
      btn.classList.remove('ready');
    }
  });

  // Aviso de dinheiro só para Belo Jardim
  function updateCashWarning() {
    var warning = document.getElementById('cashWarning');
    if (!warning) return;
    var isDinheiro = (document.querySelector('input[name="cart-payment"]:checked') || {}).value === 'Dinheiro';
    var isBeloJardim = cartCidadeUf && cartCidadeUf.toLowerCase().indexOf('belo jardim') !== -1;
    warning.style.display = (isDinheiro && cartCidadeUf && !isBeloJardim) ? 'block' : 'none';
  }

  document.querySelectorAll('input[name="cart-payment"]').forEach(function (radio) {
    radio.addEventListener('change', updateCashWarning);
  });

  function getCardImages(card) {
    return Array.from(card.querySelectorAll('.product-image img')).map(function (el) { return el.getAttribute('src'); });
  }

  document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = this.closest('.product-card');
      var name = card.querySelector('.product-name').textContent;
      var price = parseFloat(this.getAttribute('data-price'));
      openProductModal(name, price, getCardImages(card));
    });
  });

  // Quick-add cart buttons on product cards
  document.querySelectorAll('.product-card:not(.product-card--esgotado) .add-to-cart-btn').forEach(function (buyBtn) {
    var wrapper = document.createElement('div');
    wrapper.className = 'product-card-btns';

    var cartBtn = document.createElement('button');
    cartBtn.type = 'button';
    cartBtn.className = 'quick-add-btn';
    cartBtn.title = 'Adicionar ao carrinho';
    cartBtn.setAttribute('aria-label', 'Adicionar ao carrinho');
    cartBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';

    cartBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = this.closest('.product-card');
      var name = card.querySelector('.product-name').textContent;
      var price = parseFloat(buyBtn.getAttribute('data-price'));
      var img = card.querySelector('.product-image img').getAttribute('src');
      var cat = getProductCategory(name);

      var size = sizeOptions[cat] ? null : 'Tamanho Único';
      var existing = cart.find(function (item) {
        return item.name === name && item.size === size;
      });
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name: name, price: price, img: img, qty: 1, size: size });
      }
      updateCartUI();
      showToast(name + ' adicionado ao carrinho!');
      cartBtn.classList.add('added');
      setTimeout(function () { cartBtn.classList.remove('added'); }, 1500);
    });

    buyBtn.parentNode.insertBefore(wrapper, buyBtn);
    wrapper.appendChild(cartBtn);
    wrapper.appendChild(buyBtn);
  });

  // Card inteiro abre o modal ao clicar
  document.querySelectorAll('.product-card').forEach(function (card) {
    if (!card.classList.contains('product-card--esgotado')) {
      card.style.cursor = 'pointer';
    }
    card.addEventListener('click', function (e) {
      if (e.target.closest('.quick-add-btn') || card.classList.contains('product-card--esgotado')) return;
      var name = card.querySelector('.product-name').textContent;
      var buyBtn = card.querySelector('.add-to-cart-btn');
      if (!buyBtn) return;
      var price = parseFloat(buyBtn.getAttribute('data-price'));
      openProductModal(name, price, getCardImages(card));
    });
  });

  document.getElementById('cartCheckout').addEventListener('click', function () {
    if (cart.length === 0) return;

    var missingSize = cart.find(function (item) { return item.size === null; });
    if (missingSize) {
      var errorEl = document.getElementById('cartSizeError');
      errorEl.textContent = 'Escolha o tamanho de "' + missingSize.name + '" antes de finalizar.';
      errorEl.style.display = 'block';
      setTimeout(function () { errorEl.style.display = 'none'; }, 5000);
      return;
    }

    var subtotal = 0;
    var msg = 'Oi, Ana Livia! Gostaria de fazer o seguinte pedido:\n\n';

    cart.forEach(function (item, i) {
      var itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      msg += (i + 1) + '. ' + item.name;
      if (item.size) msg += ' (Tam: ' + item.size + ')';
      msg += ' - Qtd: ' + item.qty + ' - R$ ' + itemTotal.toFixed(2).replace('.', ',') + '\n';
    });

    msg += '\nSubtotal: R$ ' + subtotal.toFixed(2).replace('.', ',');

    if (freteAtual > 0 && cartCidadeUf) {
      msg += '\nEnvio para: ' + cartCidadeUf;
      msg += '\nFrete: R$ ' + freteAtual.toFixed(2).replace('.', ',');
    }

    var totalFinal = subtotal + freteAtual;
    msg += '\n*Total: R$ ' + totalFinal.toFixed(2).replace('.', ',') + '*';

    var payment = document.querySelector('input[name="cart-payment"]:checked');
    if (payment) {
      msg += '\nPagamento: ' + payment.value;
    }

    msg += '\n\nAguardo as informações para finalizar!';

    var url = 'https://wa.me/' + WHATSAPP_NUM + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');

    // Show success state
    cartItems.style.display = 'none';
    cartFooter.style.display = 'none';
    cartSuccess.style.display = 'flex';
  });

  // --- Contact form -> WhatsApp ---
  var contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = document.getElementById('nome').value.trim();
    var telefone = document.getElementById('telefone').value.trim();
    var mensagem = document.getElementById('mensagem').value.trim();

    var phoneDigits = telefone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      var telInput = document.getElementById('telefone');
      telInput.setCustomValidity('Digite um número de WhatsApp válido com DDD (ex: 81 98391-1126)');
      telInput.reportValidity();
      return;
    }
    document.getElementById('telefone').setCustomValidity('');

    var whatsappMsg = 'Oi, Ana Livia! Meu nome é ' + nome +
      '. Meu WhatsApp: ' + telefone +
      '. Minha ideia: ' + mensagem;

    var whatsappUrl = 'https://wa.me/' + WHATSAPP_NUM + '?text=' + encodeURIComponent(whatsappMsg);
    window.open(whatsappUrl, '_blank');
    contactForm.reset();
    showToast('Mensagem enviada! Ana Livia vai entrar em contato em breve.');
  });

  // --- Page panels (Medidas, Cuidados, Contato) ---
  var panelIds = ['medidas', 'cuidados', 'contato', 'sobre', 'trocas'];

  function openPanel(id) {
    var panel = document.getElementById(id);
    if (panel && panel.classList.contains('page-panel')) {
      panel.classList.add('active');
      lockScroll();
    }
  }
  window.openPanel = openPanel;

  function closeAllPanels() {
    document.querySelectorAll('.page-panel').forEach(function (p) {
      p.classList.remove('active');
    });
    unlockScroll();
  }

  document.querySelectorAll('.panel-close').forEach(function (btn) {
    btn.addEventListener('click', closeAllPanels);
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var id = targetId.replace('#', '');
      if (panelIds.indexOf(id) !== -1) {
        e.preventDefault();
        closeMenu();
        openPanel(id);
        return;
      }
      closeAllPanels();
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Active nav link highlight on scroll ---
  var sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      var link = document.querySelector('.nav-link[href="#' + id + '"]');
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          if (link.classList.contains('nav-link--highlight')) {
            link.style.background = '#d4864a';
          } else {
            link.style.background = 'rgba(139,64,96,0.12)';
          }
        } else {
          link.style.background = '';
        }
      }
    });
  }
  window.addEventListener('scroll', highlightNav);

  // --- Back to top button ---
  var backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', toggleBackToTop);

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Sort by price ---
  document.querySelectorAll('.sort-bar').forEach(function (bar) {
    var grid = bar.nextElementSibling;
    var originalOrder = Array.from(grid.querySelectorAll('.product-card'));

    bar.querySelectorAll('.sort-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('.sort-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        var sort = this.getAttribute('data-sort');
        var cards = Array.from(grid.querySelectorAll('.product-card'));

        if (sort === 'default') {
          originalOrder.forEach(function (card) { grid.appendChild(card); });
        } else {
          cards.sort(function (a, b) {
            var btnA = a.querySelector('.add-to-cart-btn');
            var btnB = b.querySelector('.add-to-cart-btn');
            var priceA = btnA ? parseFloat(btnA.getAttribute('data-price')) : 0;
            var priceB = btnB ? parseFloat(btnB.getAttribute('data-price')) : 0;
            return sort === 'low' ? priceA - priceB : priceB - priceA;
          });
          cards.forEach(function (card) { grid.appendChild(card); });
        }

        grid.querySelectorAll('.product-card').forEach(function (card) {
          card.classList.remove('visible');
        });
        setTimeout(revealCards, 100);
      });
    });
  });

  // --- Footer panel links (Sobre, Trocas) ---
  document.querySelectorAll('.footer-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var panelId = this.getAttribute('data-panel');
      var panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('active');
        lockScroll();
      }
    });
  });

  // --- Phone mask ---
  var telefoneInput = document.getElementById('telefone');
  telefoneInput.addEventListener('input', function () {
    var value = this.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      this.value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
    } else if (value.length > 2) {
      this.value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
    } else if (value.length > 0) {
      this.value = '(' + value;
    }
    this.setCustomValidity('');
  });

  // Render cart from persisted state on page load
  if (cart.length > 0) {
    updateCartUI();
  }

  // Auto-sort esgotados to end of each grid
  document.querySelectorAll('.products-grid').forEach(function (grid) {
    grid.querySelectorAll('.product-card--esgotado').forEach(function (c) {
      grid.appendChild(c);
    });
  });

  // ===== RECENTLY VIEWED =====
  var recentlyViewed = [];
  try { var rvS = localStorage.getItem('smileRV'); if (rvS) recentlyViewed = JSON.parse(rvS); } catch(e) {}

  function saveRV() { try { localStorage.setItem('smileRV', JSON.stringify(recentlyViewed)); } catch(e) {} }

  function addToRecentlyViewed(name, price, img) {
    recentlyViewed = recentlyViewed.filter(function(p) { return p.name !== name; });
    recentlyViewed.unshift({ name: name, price: price, img: img });
    if (recentlyViewed.length > 4) recentlyViewed = recentlyViewed.slice(0, 4);
    saveRV();
  }

  function renderCartRv() {
    var wrap = document.getElementById('cartRvWrap');
    var list = document.getElementById('cartRvList');
    if (!wrap || !list) return;
    if (recentlyViewed.length === 0) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'block';
    list.innerHTML = '';
    recentlyViewed.forEach(function(p) {
      var item = document.createElement('div');
      item.className = 'rv-item';
      var img = document.createElement('img');
      img.src = p.img; img.alt = p.name; img.loading = 'lazy';
      var nameEl = document.createElement('p'); nameEl.className = 'rv-name'; nameEl.textContent = p.name;
      var priceEl = document.createElement('p'); priceEl.className = 'rv-price';
      priceEl.textContent = 'R$ ' + p.price.toFixed(2).replace('.', ',');
      item.appendChild(img); item.appendChild(nameEl); item.appendChild(priceEl);
      item.addEventListener('click', function() { closeCart(); openProductModal(p.name, p.price, p.img); });
      list.appendChild(item);
    });
  }

  // ===== FAVORITES =====
  var favorites = [];
  try { var fvS = localStorage.getItem('smileFav'); if (fvS) favorites = JSON.parse(fvS); } catch(e) {}

  function saveFavorites() { try { localStorage.setItem('smileFav', JSON.stringify(favorites)); } catch(e) {} }

  var favSidebar = document.getElementById('favSidebar');
  var favOverlay = document.getElementById('favOverlay');

  function openFavPanel() {
    favSidebar.classList.add('active');
    favOverlay.classList.add('active');
    lockScroll();
    renderFavPanel();
  }

  function closeFavPanel() {
    favSidebar.classList.remove('active');
    favOverlay.classList.remove('active');
    unlockScroll();
  }

  document.getElementById('favToggle').addEventListener('click', openFavPanel);
  document.getElementById('favClose').addEventListener('click', closeFavPanel);
  favOverlay.addEventListener('click', closeFavPanel);

  document.getElementById('favClearBtn').addEventListener('click', function() {
    favorites = [];
    saveFavorites();
    document.querySelectorAll('.fav-btn.fav-active').forEach(function(b) {
      b.classList.remove('fav-active');
    });
    updateFavBadge();
    renderFavPanel();
  });

  function updateFavBadge() {
    var countEl = document.getElementById('favCount');
    var toggle = document.getElementById('favToggle');
    if (countEl) {
      countEl.textContent = favorites.length;
      countEl.style.display = favorites.length > 0 ? 'flex' : 'none';
    }
    if (toggle) toggle.classList.toggle('has-favs', favorites.length > 0);
  }

  function renderFavPanel() {
    var itemsEl = document.getElementById('favItems');
    var emptyEl = document.getElementById('favEmpty');
    var footerEl = document.getElementById('favFooter');
    if (!itemsEl) return;

    var existing = itemsEl.querySelectorAll('.fav-item');
    existing.forEach(function(el) { el.remove(); });

    if (favorites.length === 0) {
      emptyEl.style.display = 'flex';
      footerEl.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    footerEl.style.display = 'block';

    favorites.forEach(function(fav) {
      var card = Array.from(document.querySelectorAll('.product-card')).find(function(c) {
        var n = c.querySelector('.product-name');
        return n && n.textContent === fav;
      });
      if (!card) return;

      var img = card.querySelector('.product-image img');
      var priceStr = card.querySelector('.product-price').textContent;
      var buyBtn = card.querySelector('.add-to-cart-btn');
      var price = buyBtn ? parseFloat(buyBtn.getAttribute('data-price')) : 0;
      var imgSrc = img ? img.getAttribute('src') : '';

      var item = document.createElement('div');
      item.className = 'fav-item';

      var imgEl = document.createElement('img');
      imgEl.src = imgSrc; imgEl.alt = fav; imgEl.className = 'fav-item-img'; imgEl.loading = 'lazy';
      imgEl.addEventListener('click', function() { closeFavPanel(); openProductModal(fav, price, getCardImages(card)); });

      var info = document.createElement('div'); info.className = 'fav-item-info';
      var nameEl = document.createElement('p'); nameEl.className = 'fav-item-name'; nameEl.textContent = fav;
      nameEl.addEventListener('click', function() { closeFavPanel(); openProductModal(fav, price, getCardImages(card)); });
      var priceEl = document.createElement('p'); priceEl.className = 'fav-item-price'; priceEl.textContent = priceStr;
      info.appendChild(nameEl); info.appendChild(priceEl);

      var actions = document.createElement('div'); actions.className = 'fav-item-actions';
      var buyBtnEl = document.createElement('button'); buyBtnEl.type = 'button'; buyBtnEl.className = 'fav-item-buy';
      buyBtnEl.textContent = 'Comprar';
      buyBtnEl.addEventListener('click', function() { closeFavPanel(); openProductModal(fav, price, getCardImages(card)); });

      var removeBtn = document.createElement('button'); removeBtn.type = 'button'; removeBtn.className = 'fav-item-remove';
      removeBtn.textContent = 'Remover';
      removeBtn.addEventListener('click', function() {
        var idx = favorites.indexOf(fav);
        if (idx !== -1) favorites.splice(idx, 1);
        saveFavorites(); updateFavBadge();
        var cardBtn = card.querySelector('.fav-btn');
        if (cardBtn) { cardBtn.classList.add('fav-removing'); cardBtn.classList.remove('fav-active'); setTimeout(function() { cardBtn.classList.remove('fav-removing'); }, 350); }
        renderFavPanel();
      });

      actions.appendChild(buyBtnEl); actions.appendChild(removeBtn);
      item.appendChild(imgEl); item.appendChild(info); item.appendChild(actions);
      itemsEl.appendChild(item);
    });
  }

  // Add fav buttons to product cards
  document.querySelectorAll('.product-card').forEach(function(card) {
    var nameEl = card.querySelector('.product-name');
    var imgWrap = card.querySelector('.product-image');
    if (!nameEl || !imgWrap) return;
    var pname = nameEl.textContent;
    var isActive = favorites.indexOf(pname) !== -1;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fav-btn' + (isActive ? ' fav-active' : '');
    btn.setAttribute('aria-label', isActive ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = favorites.indexOf(pname);
      if (idx === -1) {
        favorites.push(pname);
        btn.classList.remove('fav-removing');
        btn.classList.add('fav-active');
        btn.setAttribute('aria-label', 'Remover dos favoritos');
        void btn.offsetWidth; // reflow to restart animation
      } else {
        favorites.splice(idx, 1);
        btn.classList.add('fav-removing');
        btn.classList.remove('fav-active');
        btn.setAttribute('aria-label', 'Adicionar aos favoritos');
        setTimeout(function() { btn.classList.remove('fav-removing'); }, 350);
      }
      saveFavorites();
      updateFavBadge();
    });
    imgWrap.appendChild(btn);
  });

  updateFavBadge();

  // ===== ESGOTADO TOGGLE =====
  var hideEsgotados = false;
  var toggleEsgBtn = document.getElementById('toggleEsgotado');
  if (toggleEsgBtn) {
    toggleEsgBtn.addEventListener('click', function() {
      hideEsgotados = !hideEsgotados;
      document.querySelectorAll('.product-card--esgotado').forEach(function(c) {
        c.style.display = hideEsgotados ? 'none' : '';
      });
      this.textContent = hideEsgotados ? 'Mostrar esgotados' : 'Ocultar esgotados';
      this.classList.toggle('active', hideEsgotados);
      updateAllCounts();
    });
  }

  // ===== PRODUCT COUNT =====
  function updateCount(sectionId) {
    var section = document.getElementById(sectionId);
    var countEl = document.getElementById('count-' + sectionId);
    if (!section || !countEl) return;
    var grid = section.querySelector('.products-grid');
    if (!grid) return;
    var visible = Array.from(grid.querySelectorAll('.product-card')).filter(function(c) {
      return c.style.display !== 'none' && !c.classList.contains('hidden');
    }).length;
    countEl.textContent = visible + (visible === 1 ? ' produto' : ' produtos');
  }

  function updateAllCounts() {
    ['bolsas','pulseiras','colares','tornozeleiras','body-chain'].forEach(updateCount);
  }

  updateAllCounts();

  // ===== ZOOM LIGHTBOX =====
  var zoomOverlay = document.getElementById('zoomOverlay');
  var zoomImg = document.getElementById('zoomImg');

  document.getElementById('modalGalleryTrack').addEventListener('click', function(e) {
    var img = e.target.closest('.modal-gallery-img');
    if (!img || window.innerWidth <= 768) return;
    zoomImg.src = img.src;
    zoomImg.alt = img.alt;
    zoomOverlay.classList.add('active');
  });

  document.getElementById('zoomClose').addEventListener('click', function() {
    zoomOverlay.classList.remove('active');
  });

  zoomOverlay.addEventListener('click', function(e) {
    if (e.target === zoomOverlay || e.target === zoomImg) zoomOverlay.classList.remove('active');
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') zoomOverlay.classList.remove('active');
  });
});
