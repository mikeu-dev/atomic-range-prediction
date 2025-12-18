# Deployment Guide - Atomic Range Prediction

Panduan lengkap untuk deploy aplikasi ke production.

---

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] No console errors
- [ ] Production build berhasil
- [ ] Environment variables configured
- [ ] Performance optimized
- [ ] SEO metadata added

---

## 🏗️ Build for Production

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Production Build

```bash
npm run build
```

Build output akan dioptimalkan untuk Vercel (menggunakan `@sveltejs/adapter-vercel`).

### 3. Preview Production Build (Optional)

```bash
npm run preview
```

Test di `http://localhost:4173`

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Keunggulan:**
- Zero configuration untuk SvelteKit
- Automatic deployments dari Git
- Global CDN
- Free SSL certificate
- Serverless functions support

**Steps:**

1. **Konfigurasi Adapter** (Sudah dilakukan)
   Kami menggunakan `@sveltejs/adapter-vercel` untuk integrasi terbaik.

2. **Push ke Git**
   Push kode Anda ke GitHub, GitLab, atau Bitbucket.

3. **Impor di Vercel**
   - Masuk ke dashboard [vercel.com](https://vercel.com).
   - Klik "Add New" -> "Project".
   - Impor repositori Anda.
   - Vercel akan mendeteksi SvelteKit dan menggunakan pengaturan yang ada di `vercel.json` dan `svelte.config.js`.

4. **Deploy**
   Klik "Deploy". Selesai!

**Vercel CLI (Alternatif):**
```bash
npm install -g vercel
vercel      # Untuk preview
vercel --prod # Untuk production
```

**Auto-Deploy dari GitHub:**

1. Push code ke GitHub repository
2. Connect repository di [vercel.com](https://vercel.com)
3. Vercel akan auto-deploy setiap push ke main branch

**Custom Domain:**
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records sesuai instructions

---

### Option 2: Netlify

**Keunggulan:**
- Easy drag-and-drop deployment
- Form handling built-in
- Split testing
- Free tier generous

**Steps:**

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

**Or via Web UI:**

1. Go to [netlify.com](https://netlify.com)
2. Drag `build` folder to deploy
3. Configure custom domain jika perlu

**netlify.toml Configuration:**

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages

**Keunggulan:**
- Free hosting
- Terintegrasi dengan GitHub
- Good untuk documentation sites

**Steps:**

1. **Install adapter-static**
   ```bash
   npm install -D @sveltejs/adapter-static
   ```

2. **Update svelte.config.js**
   ```javascript
   import adapter from '@sveltejs/adapter-static';

   export default {
       kit: {
           adapter: adapter({
               pages: 'build',
               assets: 'build',
               fallback: null
           })
       }
   };
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Deploy via gh-pages**
   ```bash
   npm install -D gh-pages
   npx gh-pages -d build
   ```

---

### Option 4: Self-Hosted (VPS/Dedicated Server)

**Steps:**

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Setup Node.js di Server**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Upload Build Files**
   ```bash
   # Via SCP
   scp -r build/ user@server:/var/www/atomic-range
   
   # Or via Git
   git clone your-repo
   cd your-repo
   npm install
   npm run build
   ```

4. **Setup with PM2**
   ```bash
   npm install -g pm2
   pm2 start build/index.js --name atomic-range
   pm2 startup
   pm2 save
   ```

5. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Setup SSL dengan Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## ⚙️ Environment Variables

Jika ada environment variables yang perlu dikonfigurasi:

```bash
# .env.production
PUBLIC_API_URL=https://api.yourdomain.com
PUBLIC_ANALYTICS_ID=your-analytics-id
```

**Vercel:**
- Project Settings → Environment Variables

**Netlify:**
- Site Settings → Build & Deploy → Environment

---

## 🔧 Build Optimization

### 1. Enable Compression

**svelte.config.js:**
```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

export default {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            runtime: 'edge' // untuk edge deployment
        })
    }
};
```

### 2. Optimize Images

```bash
# Install image optimization
npm install -D vite-imagetools

# vite.config.js
import { imagetools } from 'vite-imagetools';

export default {
    plugins: [imagetools()]
};
```

### 3. Code Splitting

SvelteKit automatically code-splits routes. Pastikan components di-lazy load:

```svelte
<script>
    import { onMount } from 'svelte';
    
    let Component;
    onMount(async () => {
        Component = (await import('./HeavyComponent.svelte')).default;
    });
</script>
```

---

## 📊 Performance Monitoring

### Setup Analytics (Optional)

**Google Analytics:**

```html
<!-- app.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Plausible (Privacy-friendly):**

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## 🔒 Security Headers

Add security headers di deployment platform:

**Vercel (vercel.json):**
```json
{
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {
                    "key": "X-Content-Type-Options",
                    "value": "nosniff"
                },
                {
                    "key": "X-Frame-Options",
                    "value": "DENY"
                },
                {
                    "key": "X-XSS-Protection",
                    "value": "1; mode=block"
                }
            ]
        }
    ]
}
```

**Netlify (_headers file):**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

---

## 🧪 Post-Deployment Validation

### 1. Functionality Check

- [ ] Map loads correctly
- [ ] Bomb selection works
- [ ] Click events trigger simulations
- [ ] Export functions working
- [ ] Comparison mode functional
- [ ] Tutorial auto-starts

### 2. Performance Check

```bash
# Test with Lighthouse
npx lighthouse https://yourdomain.com --view
```

Target scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

### 3. Cross-Browser Testing

Test di:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔄 Continuous Deployment

### GitHub Actions Workflow

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Map Tidak Muncul

- Check amCharts license
- Verify bundle includes map data
- Check browser console untuk errors

### Export Tidak Bekerja

- Verify html2canvas dan jsPDF di bundle
- Check CORS headers jika menggunakan external images
- Test dengan different browsers

---

## 📝 Maintenance

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update all dependencies
npm update

# Update to latest major versions (careful!)
npx npm-check-updates -u
npm install
```

### Backup

Regular backup untuk:
- Source code (Git)
- User data (jika ada)
- Configuration files
- Environment variables

---

## ✅ Production Checklist

- [ ] Code reviewed
- [ ] Tests passing
- [ ] Build successful
- [ ] Dependencies updated
- [ ] Security headers configured
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Analytics setup (optional)
- [ ] Performance optimized (Lighthouse > 90)
- [ ] Cross-browser tested
- [ ] Mobile responsive verified
- [ ] Error monitoring setup
- [ ] Backup strategy planned

---

**🎉 Ready to Deploy!**

Pilih deployment method yang sesuai dan follow the steps. Good luck!
