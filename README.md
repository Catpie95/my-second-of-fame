# Il Mio Secondo di Fama 🎬

Un'applicazione web che permette di vendere secondi di video che girano 24/7. Ogni secondo costa €1!

## 🚀 Deploy su Vercel

### Prerequisiti
- Account GitHub
- Account Vercel (gratuito)

### Passi per il Deploy

1. **Push su GitHub**
   ```bash
   git add .
   git commit -m "Preparato per deploy Vercel"
   git push origin main
   ```

2. **Connetti a Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Clicca "New Project"
   - Importa il repository GitHub
   - Vercel rileverà automaticamente che è un progetto Next.js

3. **Configura Vercel KV**
   - Nel dashboard Vercel, vai su "Storage"
   - Crea un nuovo database KV
   - Copia le variabili d'ambiente nel progetto

4. **Deploy Automatico**
   - Ogni push su GitHub triggererà un nuovo deploy
   - Il sito sarà disponibile su `https://tuo-progetto.vercel.app`

## 🛠️ Sviluppo Locale

```bash
npm install
npm run dev
```

## 📁 Struttura del Progetto

- `app/` - App Router di Next.js 14
- `app/api/` - API routes per upload e gestione video
- `app/components/` - Componenti React
- `app/upload/` - Pagina di upload video
- `public/videos/` - Video statici (solo per sviluppo)

## 🎯 Funzionalità

- ✅ Upload video con programmazione temporale
- ✅ Scheduling per giorni e orari specifici
- ✅ Pricing dinamico basato sui giorni
- ✅ Rotazione automatica dei video
- ✅ Audio intelligente con fallback
- ✅ Adattamento video con effetti blur
- ✅ Database cloud con Vercel KV

## 🔧 Tecnologie

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Vercel KV (Redis)
- **Deploy**: Vercel
- **Video Storage**: Cloudinary (raccomandato)

## 📝 Note per la Produzione

- I video vengono salvati in `public/videos/` solo in sviluppo
- In produzione, usa Cloudinary o AWS S3 per i video
- Vercel KV gestisce il database per scheduling
- Il deploy è automatico con GitHub

## 🎬 Come Funziona

1. **Upload**: Carica un video e seleziona giorni/orari
2. **Pricing**: Il sistema calcola il prezzo in base ai giorni
3. **Scheduling**: I video appaiono solo negli orari programmati
4. **Rotazione**: Cambio automatico ogni 30 secondi
5. **Audio**: Gestione intelligente con fallback

## 🚀 Caratteristiche

- **Video 24/7**: Un video che gira continuamente su YouTube
- **Vendita Secondi**: Ogni secondo costa €1
- **Personalizzazione**: Possibilità di aggiungere il proprio nome/logo
- **Caricamento Video**: Sistema per caricare video personalizzati
- **Multilingua**: Supporto per Italiano e Inglese
- **Design Moderno**: Interfaccia accattivante con animazioni

## 🛠️ Tecnologie

- **Next.js 14** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animazioni
- **Lucide React** - Icone
- **React Dropzone** - Upload file

## 📦 Installazione

1. Clona il repository:
```bash
git clone https://github.com/tuousername/mio-secondo-di-fama.git
cd mio-secondo-di-fama
```

2. Installa le dipendenze:
```bash
npm install
```

3. Avvia il server di sviluppo:
```bash
npm run dev
```

4. Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 🎯 Funzionalità Principali

### 1. Hero Section
- Titolo accattivante con animazioni
- Call-to-action per acquistare secondi
- Statistiche del progetto

### 2. Caricamento Video
- Drag & drop per caricare video
- Supporto per formati multipli (MP4, AVI, MOV, MKV, WEBM)
- Limite di 100MB per file
- Feedback visivo durante il caricamento

### 3. Acquisto Secondi
- Selezione del numero di secondi (1, 5, 10, 30, 60)
- Campo per nome/logo personalizzato
- Calcolo automatico del prezzo
- Simulazione del processo di pagamento

### 4. Navigazione
- Menu responsive
- Selettore lingua (IT/EN)
- Smooth scrolling

## 🌍 Internazionalizzazione

Il progetto supporta due lingue:
- **Italiano** (default)
- **Inglese**

Le traduzioni sono gestite tramite il context `LanguageContext`.

## 🎨 Design

- **Tema**: Dark con gradienti
- **Colori**: Arancione (primary) e Viola (fame)
- **Effetti**: Glassmorphism, animazioni fluide
- **Responsive**: Ottimizzato per mobile e desktop

## 📱 Responsive

L'applicazione è completamente responsive e si adatta a:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 📄 Licenza

MIT License - vedi il file [LICENSE](LICENSE) per i dettagli.

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📞 Contatti

- Email: info@miosecondodifama.com
- Telefono: +39 123 456 7890
- Orari: 24/7

---

**Il Mio Secondo di Fama** - Vendi secondi di video che girano 24/7! ⭐ 