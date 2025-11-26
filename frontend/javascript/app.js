const openBtn = document.getElementById("open-apply");
const modal = document.getElementById("apply-modal");
const closeBtn = document.getElementById("apply-close");
const backdrop = document.getElementById("apply-backdrop");
const form = document.getElementById("apply-form");
const statusEl = document.getElementById("apply-status");

function openModal(){
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  form.reset();
  statusEl.textContent = "";
  statusEl.className = "form-status";
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (e)=> {
  if(e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Отправляем...";

  const data = Object.fromEntries(new FormData(form).entries());

  try{
    const res = await fetch("http://localhost:8000/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if(!res.ok) throw new Error("Ошибка отправки");

    statusEl.textContent = "Заявка отправлена ✅";
    statusEl.className = "form-status success";
    setTimeout(closeModal, 1200);
  }catch(err){
    statusEl.textContent = "Не удалось отправить заявку";
    statusEl.className = "form-status error";
  }
});
// ======= CATALOG MODAL =======
const openCatalogBtn = document.getElementById("open-catalog");
const catalogModal = document.getElementById("catalog-modal");
const catalogCloseBtn = document.getElementById("catalog-close");
const catalogBackdrop = document.getElementById("catalog-backdrop");
const catalogForm = document.getElementById("catalog-form");
const catalogStatus = document.getElementById("catalog-status");

function openCatalogModal(){
  catalogModal.classList.add("show");
  catalogModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeCatalogModal(){
  catalogModal.classList.remove("show");
  catalogModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  catalogForm.reset();
  catalogStatus.textContent = "";
  catalogStatus.className = "form-status";
}

openCatalogBtn.addEventListener("click", openCatalogModal);
catalogCloseBtn.addEventListener("click", closeCatalogModal);
catalogBackdrop.addEventListener("click", closeCatalogModal);

catalogForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  catalogStatus.textContent = "Отправляем каталог...";
  catalogStatus.className = "form-status";

  const data = Object.fromEntries(new FormData(catalogForm).entries());

  try {
    const res = await fetch("http://localhost:8000/catalog", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    if(!res.ok){
      const err = await res.json().catch(()=> ({}));
      throw new Error(err.detail || "Ошибка отправки");
    }

    catalogStatus.textContent = "Каталог отправлен вам на почту ✅";
    catalogStatus.classList.add("success");
    setTimeout(closeCatalogModal, 1400);

  } catch (err) {
    catalogStatus.textContent = "Не удалось отправить каталог: " + err.message;
    catalogStatus.classList.add("error");
  }
});

// ======= BUY MODAL =======
const openBuyBtn = document.getElementById("open-buy");
const buyModal = document.getElementById("buy-modal");
const buyCloseBtn = document.getElementById("buy-close");
const buyBackdrop = document.getElementById("buy-backdrop");
const buyForm = document.getElementById("buy-form");
const buyStatus = document.getElementById("buy-status");

function openBuyModal(){
  buyModal.classList.add("show");
  buyModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeBuyModal(){
  buyModal.classList.remove("show");
  buyModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  buyForm.reset();
  buyStatus.textContent = "";
  buyStatus.className = "form-status";
}

openBuyBtn.addEventListener("click", openBuyModal);
buyCloseBtn.addEventListener("click", closeBuyModal);
buyBackdrop.addEventListener("click", closeBuyModal);

buyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  buyStatus.textContent = "Отправляем...";
  buyStatus.className = "form-status";

  const data = Object.fromEntries(new FormData(buyForm).entries());

  try{
    const res = await fetch("http://localhost:8000/buy", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(data)
    });

    if(!res.ok){
      const err = await res.json().catch(()=> ({}));
      throw new Error(err.detail || "Ошибка отправки");
    }

    buyStatus.textContent = "Отправлено! Мы свяжемся ✅";
    buyStatus.classList.add("success");
    setTimeout(closeBuyModal, 1400);

  }catch(err){
    buyStatus.textContent = "Не удалось отправить: " + err.message;
    buyStatus.classList.add("error");
  }
});

