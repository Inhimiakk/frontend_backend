from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import os
import smtplib
from email.message import EmailMessage
from pathlib import Path

app = FastAPI()

# CORS, чтобы фронт мог слать запросы на backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для учебы ок; в проде лучше указать домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
#        МОДЕЛИ
# =======================
class ApplyForm(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    telegram: str

class CatalogForm(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    telegram: str

class BuyForm(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    telegram: str


# =======================
#        SMTP
# =======================
def get_smtp_settings():
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASS = os.getenv("SMTP_PASS")
    TO_EMAIL = os.getenv("TO_EMAIL") or SMTP_USER

    if not all([SMTP_HOST, SMTP_USER, SMTP_PASS, TO_EMAIL]):
        raise RuntimeError("SMTP env vars are not set")

    return SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL


def send_email_basic(subject: str, body: str, to_email: str):
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, _ = get_smtp_settings()

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg.set_content(body)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)


def send_catalog_email(form: CatalogForm):
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, _ = get_smtp_settings()

    # catalog.pdf должен лежать: frontend/assets/catalog.pdf
    catalog_path = Path(__file__).resolve().parents[1] / "frontend" / "assets" / "catalog.pdf"
    if not catalog_path.exists():
        raise RuntimeError(f"Catalog file not found: {catalog_path}")

    msg = EmailMessage()
    msg["Subject"] = "Каталог курсов"
    msg["From"] = SMTP_USER
    msg["To"] = form.email

    msg.set_content(
        f"Здравствуйте, {form.full_name}!\n\n"
        f"Спасибо за интерес к нашим курсам. Во вложении — каталог.\n\n"
        f"Ваши контакты:\n"
        f"Email: {form.email}\n"
        f"Телефон: {form.phone}\n"
        f"Telegram: {form.telegram}\n"
    )

    file_bytes = catalog_path.read_bytes()
    msg.add_attachment(
        file_bytes,
        maintype="application",
        subtype="pdf",
        filename="catalog.pdf"
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)


# =======================
#       ЭНДПОИНТЫ
# =======================

@app.post("/apply")
def apply(form: ApplyForm):
    """
    Заявка на курс -> письмо ТЕБЕ на почту
    """
    try:
        _, _, _, _, TO_EMAIL = get_smtp_settings()

        body = (
            "Новая заявка на курс:\n\n"
            f"ФИО: {form.full_name}\n"
            f"Почта: {form.email}\n"
            f"Телефон: {form.phone}\n"
            f"Telegram: {form.telegram}\n"
        )

        send_email_basic("Новая заявка на курс", body, TO_EMAIL)
        return {"status": "ok"}

    except Exception as e:
        print("APPLY ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=repr(e))


@app.post("/catalog")
def catalog(form: CatalogForm):
    """
    Получить каталог -> письмо ПОЛЬЗОВАТЕЛЮ с PDF-вложением
    """
    try:
        send_catalog_email(form)
        return {"status": "ok"}

    except Exception as e:
        print("CATALOG ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=repr(e))


@app.post("/buy")
def buy(form: BuyForm):
    """
    Купити курс -> письмо ТЕБЕ, что человек готов оплатить
    """
    try:
        _, _, _, _, TO_EMAIL = get_smtp_settings()

        body = (
            "Пользователь готов оплатить курс ✅\n\n"
            f"ФИО: {form.full_name}\n"
            f"Почта: {form.email}\n"
            f"Телефон: {form.phone}\n"
            f"Telegram: {form.telegram}\n"
        )

        send_email_basic("Покупка курса — пользователь готов оплатить", body, TO_EMAIL)
        return {"status": "ok"}

    except Exception as e:
        print("BUY ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=repr(e))
