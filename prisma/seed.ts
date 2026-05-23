import { PrismaClient, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Menyiapkan Super Seed Beranda Desa Pasirlangu – Kec. Cisarua, Bandung Barat...');

  const existingUser = await prisma.user.findFirst();
  if (!existingUser) {
    throw new Error('❌ Database kosong! Buat user admin dulu sebelum menjalankan seed ini.');
  }

  const authorId = existingUser.id;

  // ============================================================
  // DATA BLOCKS BERANDA — 14 SECTION BUILDER
  // Setiap object mewakili satu section di halaman beranda.
  // Field "data" disesuaikan persis dengan props masing-masing
  // Master Component yang ada di builder.
  // ============================================================
  const homeContent = [

    // ──────────────────────────────────────────────────────────
    // 1. HERO BANNER (MasterHeroBannerPage)
    //    Slider fullscreen dengan quick-link di footer bar.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-hero-banner',
      type: 'hero_banner',
      data: {
        slides: [
          {
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop',
            title: 'Selamat Datang di Desa Pasirlangu',
            desc: 'Mewujudkan desa mandiri yang sejahtera, berbudaya, dan inovatif di kaki Gunung Burangrang, Kecamatan Cisarua, Bandung Barat.'
          },
          {
            image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=2070&auto=format&fit=crop',
            title: 'Pesona Alam & Agrowisata Pasirlangu',
            desc: 'Menikmati udara sejuk pegunungan, hamparan kebun sayur holtikultura, dan kehangatan tradisi warga lokal yang ramah.'
          },
          {
            image: 'https://images.unsplash.com/photo-1593113565694-c6c7b919d675?q=80&w=2070&auto=format&fit=crop',
            title: 'Gotong Royong Warga yang Kuat',
            desc: 'Kebersamaan dan semangat kolektif warga Pasirlangu menjadi modal utama pembangunan desa yang berkelanjutan dan inklusif.'
          }
        ],
        quickLinks: [
          { label: 'Profil Desa', url: '/p/profil-desa' },
          { label: 'Layanan Warga', url: '/p/layanan' },
          { label: 'Produk UMKM', url: '/p/katalog' },
          { label: 'Kontak Kami', url: '/p/kontak' }
        ]
      }
    },

    // ──────────────────────────────────────────────────────────
    // 2. ABOUT SECTION (MasterAboutSection)
    //    Profil singkat desa dengan gambar kapsul dan teks naratif.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-about',
      type: 'about_section',
      data: {
        badge: 'Tentang Pasirlangu',
        headlineHtml:
          '<strong class="font-black text-blue-950">Desa Pasirlangu</strong> adalah sentra agrobisnis dan wisata alam yang tumbuh di ketinggian 1.100 mdpl, Kecamatan Cisarua, Kabupaten Bandung Barat.',
        description:
          'Dengan luas wilayah lebih dari 1.240 hektar dan populasi lebih dari 8.500 jiwa, Desa Pasirlangu memiliki potensi besar di sektor pertanian holtikultura, peternakan sapi perah, serta pariwisata berbasis alam. Pemerintah desa berkomitmen menghadirkan pelayanan publik yang cepat, transparan, dan digital.',
        linkText: 'Sejarah & Profil Lengkap',
        linkUrl: '/p/profil-desa',
        imgUrl:
          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop',
        imgCaption: 'Pemandangan Desa Pasirlangu'
      }
    },

    // ──────────────────────────────────────────────────────────
    // 3. IMPACT DASHBOARD (MasterImpactDashboard)
    //    Statistik kunci desa: populasi, luas wilayah, jumlah UMKM.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-dashboard',
      type: 'dashboard',
      data: {
        sectionSection: 'STATISTIK TERBUKA',
        sectionTitle: 'Pasirlangu dalam Angka',
        badgeText: 'Data Terpadu Desa',
        metric1: {
          label: 'POPULASI',
          value: '8.542',
          unit: 'Jiwa',
          subtitle: 'Penduduk Terdaftar',
          desc: 'Tersebar di 15 Rukun Warga (RW) dan 64 Rukun Tetangga (RT) yang aktif dalam musyawarah desa.'
        },
        metric2: {
          label: 'LUAS WILAYAH',
          value: '1.240',
          unit: 'Hektar',
          subtitle: 'Area Administratif',
          desc: 'Didominasi lahan pertanian produktif, peternakan, kebun teh, dan area pemukiman warga yang padat.'
        },
        metric3: {
          label: 'PENGGERAK EKONOMI',
          value: '124',
          unit: 'UMKM',
          subtitle: 'Binaan BUMDes',
          desc: 'Usaha mikro warga yang bergerak di sektor agrobisnis, susu perah, kerajinan, dan kuliner lokal.'
        },
        disclaimerTitle: 'Sistem Informasi Desa Terpadu',
        disclaimerDesc:
          'Data demografi dan statistik ini diperbarui secara berkala oleh aparat Pemerintah Desa Pasirlangu untuk mendukung perencanaan pembangunan yang akurat, adil, dan tepat sasaran bagi seluruh warga.',
        buttonText: 'Unduh Laporan APBDes'
      }
    },

    // ──────────────────────────────────────────────────────────
    // 4. CORE VALUES GRID (MasterCoreValuesGrid)
    //    Visi, Misi, dan Nilai Inti Pemerintahan Desa Pasirlangu.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-visi-misi',
      type: 'core_values_grid',
      data: {
        visionBadge: 'VISI DESA',
        visionTitle: 'Desa Pasirlangu 2025–2030',
        visionDesc:
          'Terwujudnya Desa Pasirlangu yang Mandiri, Sejahtera, Berbudaya, dan Berdaya Saing Berbasis Potensi Lokal.',
        visionTarget: 'Target Realisasi: Akhir Periode 2030',
        missionBadge: 'MISI PEMERINTAHAN DESA',
        missionTitle: 'Lima Pilar Pembangunan Desa',
        missions: [
          { text: 'Meningkatkan kualitas tata kelola pemerintahan desa yang transparan, akuntabel, dan partisipatif.' },
          { text: 'Mengembangkan potensi ekonomi lokal melalui pemberdayaan UMKM, BUMDes, dan koperasi warga.' },
          { text: 'Meningkatkan kualitas infrastruktur dasar: jalan, irigasi, sanitasi, dan akses air bersih.' },
          { text: 'Memperkuat ketahanan sosial budaya dan kearifan lokal masyarakat Sunda Pasirlangu.' },
          { text: 'Mendorong transformasi digital layanan publik agar mudah diakses seluruh lapisan warga.' },
          { text: 'Menjaga kelestarian lingkungan hidup sebagai aset wisata dan pertanian jangka panjang.' }
        ],
        valuesBadge: 'NILAI INTI',
        valuesTitle: 'Landasan Kerja Aparat Desa',
        valuesDesc: 'Nilai-nilai yang menjadi pedoman setiap keputusan dan tindakan aparatur Pemerintah Desa Pasirlangu.',
        coreValues: [
          {
            title: 'Integritas',
            desc: 'Jujur, konsisten, dan bertanggung jawab dalam setiap penyelenggaraan pemerintahan dan pelayanan publik.',
            iconType: 'shield'
          },
          {
            title: 'Gotong Royong',
            desc: 'Membangun desa bersama-sama dengan semangat kebersamaan, kolaborasi, dan partisipasi aktif warga.',
            iconType: 'users'
          },
          {
            title: 'Inovasi',
            desc: 'Mendorong solusi kreatif dan adaptasi teknologi untuk meningkatkan efisiensi layanan dan potensi ekonomi desa.',
            iconType: 'zap'
          },
          {
            title: 'Transparansi',
            desc: 'Membuka akses informasi anggaran, program, dan kebijakan kepada seluruh warga secara proaktif.',
            iconType: 'target'
          },
          {
            title: 'Berorientasi Warga',
            desc: 'Setiap program dan keputusan didasarkan pada kebutuhan nyata dan aspirasi masyarakat Pasirlangu.',
            iconType: 'compass'
          },
          {
            title: 'Berkelanjutan',
            desc: 'Menjaga keseimbangan pembangunan ekonomi, sosial, dan lingkungan untuk generasi Pasirlangu yang akan datang.',
            iconType: 'award'
          }
        ]
      }
    },

    // ──────────────────────────────────────────────────────────
    // 5. STRATEGIC SECTORS (MasterStrategicSectors)
    //    Potensi unggulan desa: pertanian, peternakan, wisata, BUMDes.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-sectors',
      type: 'strategic_sectors',
      data: {
        badge: 'POTENSI UNGGULAN',
        title: 'Empat Pilar Penggerak Ekonomi Pasirlangu',
        cards: [
          {
            title: 'Pertanian Holtikultura',
            image:
              'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=800&auto=format&fit=crop',
            icon: '🌿',
            url: '/p/potensi-pertanian'
          },
          {
            title: 'Peternakan Sapi Perah',
            image:
              'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=800&auto=format&fit=crop',
            icon: '🐄',
            url: '/p/potensi-peternakan'
          },
          {
            title: 'Agrowisata & Alam',
            image:
              'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop',
            icon: '⛰️',
            url: '/p/destinasi-wisata'
          },
          {
            title: 'UMKM & BUMDes',
            image:
              'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
            icon: '🛍️',
            url: '/p/bumdes'
          }
        ]
      }
    },

    // ──────────────────────────────────────────────────────────
    // 6. CAROUSEL CARDS (MasterCarouselCards)
    //    Destinasi wisata unggulan Pasirlangu dalam format carousel.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-wisata-carousel',
      type: 'carousel_cards',
      data: {
        sectionLabel: 'DESTINASI WISATA',
        sectionTitle: 'Jelajahi Keindahan Pasirlangu',
        cards: [
          {
            title: 'Kebun Teh Cisarua',
            imgUrl:
              'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?q=80&w=600&auto=format&fit=crop',
            iconType: 'compass',
            linkUrl: '/p/destinasi-wisata#kebun-teh'
          },
          {
            title: 'Curug Pasirlangu',
            imgUrl:
              'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop',
            iconType: 'zap',
            linkUrl: '/p/destinasi-wisata#curug'
          },
          {
            title: 'Camping Ground Burangrang',
            imgUrl:
              'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600&auto=format&fit=crop',
            iconType: 'shield',
            linkUrl: '/p/destinasi-wisata#camping'
          },
          {
            title: 'Ladang Strawberry',
            imgUrl:
              'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=600&auto=format&fit=crop',
            iconType: 'cpu',
            linkUrl: '/p/destinasi-wisata#strawberry'
          },
          {
            title: 'Panorama Gunung Burangrang',
            imgUrl:
              'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600&auto=format&fit=crop',
            iconType: 'compass',
            linkUrl: '/p/destinasi-wisata#panorama'
          }
        ]
      }
    },

    // ──────────────────────────────────────────────────────────
    // 7. EXTRACTION FLOW → Alur Pelayanan Desa (MasterExtractionFlow)
    //    Panduan langkah-langkah mengurus surat-menyurat di Balai Desa.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-alur-layanan',
      type: 'flow',
      data: {
        badge: 'SOP PELAYANAN PUBLIK',
        title: 'Cara Mudah Mengurus Administrasi Desa',
        subtitle:
          'Prosedur transparan dan efisien untuk pengurusan dokumen kependudukan seperti SKCK, Surat Domisili, Keterangan Usaha, hingga Surat Tidak Mampu. Seluruh layanan GRATIS.',
        steps: [
          {
            phase: '01',
            title: 'Siapkan Berkas & Minta Pengantar RT/RW',
            desc: 'Pemohon menyiapkan KTP asli, Kartu Keluarga (KK), dan dokumen pendukung lainnya, lalu meminta surat pengantar dari Ketua RT dan Ketua RW setempat.'
          },
          {
            phase: '02',
            title: 'Datang ke Loket Pelayanan Balai Desa',
            desc: 'Bawa lengkap semua berkas ke loket Balai Desa Pasirlangu pada hari Senin–Jumat pukul 08.00–15.00 WIB. Petugas akan melakukan verifikasi data.'
          },
          {
            phase: '03',
            title: 'Proses & Penerbitan Dokumen Resmi',
            desc: 'Berkas diproses oleh Sekretariat Desa. Dokumen dicetak, ditandatangani oleh Kepala Desa, dan stempel resmi dilekatkan. Estimasi selesai: 1 hari kerja.'
          },
          {
            phase: '04',
            title: 'Pengambilan Dokumen & Selesai',
            desc: 'Pemohon mengambil dokumen yang telah selesai di loket tanpa dikenakan biaya apapun. Layanan ini 100% gratis sesuai regulasi yang berlaku.'
          }
        ]
      }
    },

    // ──────────────────────────────────────────────────────────
    // 8. PRODUCT CATALOG (MasterProductCatalog)
    //    Etalase produk UMKM lokal yang terhubung ke database.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-katalog-umkm',
      type: 'product_catalog',
      data: {
        badge: 'PASAR DIGITAL DESA',
        title: 'Produk Unggulan UMKM Pasirlangu',
        subtitle:
          'Dukung perekonomian warga lokal dengan membeli produk autentik langsung dari tangan para perajin, petani, dan pengusaha kecil Desa Pasirlangu.'
      }
    },

    // ──────────────────────────────────────────────────────────
    // 9. NEWSROOM SECTION (MasterNewsroomSection)
    //    Berita dan kegiatan terkini dari desa.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-berita',
      type: 'newsroom_section',
      data: {
        badge: 'KABAR DESA',
        title: 'Informasi & Kegiatan Terkini Pasirlangu',
        linkText: 'Lihat Semua Berita',
        linkUrl: '/p/berita-desa',
        categorySlug: 'berita-desa',
        limit: 4
      }
    },

    // ──────────────────────────────────────────────────────────
    // 10. GALLERY GRID (MasterGalleryGrid)
    //     Dokumentasi kegiatan dan kehidupan desa.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-galeri',
      type: 'gallery',
      data: {
        badge: 'DOKUMENTASI KEGIATAN',
        title: 'Galeri Kehidupan Desa Pasirlangu',
        tagline: 'Pesona & Semangat Pasirlangu',
        images: [
          {
            id: 'gal-1',
            title: 'Kerja Bakti Gotong Royong',
            caption: 'Kegiatan rutin perbaikan jalan desa dan saluran irigasi di lingkungan RW 03 dan RW 07.',
            sizeClass: 'md:col-span-8 aspect-video',
            imgUrl:
              'https://images.unsplash.com/photo-1593113565694-c6c7b919d675?q=80&w=1200&auto=format&fit=crop'
          },
          {
            id: 'gal-2',
            title: 'Panen Sayur Holtikultura',
            caption: 'Syukuran panen bersama gabungan kelompok tani (Gapoktan) Pasirlangu.',
            sizeClass: 'md:col-span-4 aspect-square md:aspect-auto',
            imgUrl:
              'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=600&auto=format&fit=crop'
          },
          {
            id: 'gal-3',
            title: 'Rapat Musyawarah Desa',
            caption: 'Forum musyawarah warga untuk menetapkan prioritas pembangunan tahun berjalan.',
            sizeClass: 'md:col-span-4 aspect-square md:aspect-auto',
            imgUrl:
              'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=600&auto=format&fit=crop'
          },
          {
            id: 'gal-4',
            title: 'Kegiatan Posyandu Lansia',
            caption: 'Pemeriksaan kesehatan rutin bagi balita, ibu hamil, dan warga lanjut usia se-Desa Pasirlangu.',
            sizeClass: 'md:col-span-8 aspect-video',
            imgUrl:
              'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop'
          }
        ]
      }
    },

    // ──────────────────────────────────────────────────────────
    // 11. CERTIFICATIONS & AWARDS (MasterCertificationsAwards)
    //     Pencapaian dan penghargaan yang diraih Desa Pasirlangu.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-prestasi',
      type: 'certifications_awards',
      data: {
        title: 'Pencapaian & Penghargaan Desa',
        description:
          'Pengakuan resmi dari berbagai instansi pemerintah dan lembaga independen atas kinerja tata kelola dan pembangunan Desa Pasirlangu.',
        certs: [
          {
            title: 'Desa Mandiri – Indeks Desa Membangun (IDM)',
            desc: 'Berhasil naik status dari Desa Maju menjadi Desa Mandiri berdasarkan penilaian Kemendes PDTT tahun 2023.'
          },
          {
            title: 'Penghargaan Keterbukaan Informasi Publik',
            desc: 'Meraih predikat "Informatif" dari Komisi Informasi Jawa Barat atas transparansi APBDes dan layanan digital.'
          },
          {
            title: 'Desa BUMDes Terbaik Kabupaten Bandung Barat',
            desc: 'Juara II BUMDes Terbaik tingkat kabupaten atas inovasi pengembangan usaha desa berbasis produk lokal.'
          },
          {
            title: 'Kawasan Agrowisata Binaan Disbudpar Jabar',
            desc: 'Ditetapkan sebagai salah satu kawasan agrowisata potensial binaan Dinas Pariwisata Provinsi Jawa Barat.'
          },
          {
            title: 'Sertifikasi PIRT Produk UMKM Lokal',
            desc: '17 produk UMKM Pasirlangu telah mengantongi sertifikat PIRT resmi dari Dinas Kesehatan Kabupaten Bandung Barat.'
          },
          {
            title: 'Juara Lomba Desa Tingkat Kecamatan Cisarua',
            desc: 'Meraih juara pertama perlombaan desa dengan penilaian terbaik pada bidang administrasi dan pemberdayaan masyarakat.'
          }
        ]
      }
    },

    // ──────────────────────────────────────────────────────────
    // 12. FAQ ACCORDION (MasterFaqAccordion)
    //     Pertanyaan yang sering diajukan seputar layanan desa.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-faq',
      type: 'faq',
      data: {
        title: 'Pertanyaan Seputar Layanan Desa',
        subtitle:
          'Kumpulan informasi paling sering ditanyakan oleh warga Pasirlangu maupun tamu dari luar desa.',
        faqs: [
          {
            q: 'Apa saja jam operasional Balai Desa Pasirlangu?',
            a: 'Balai Desa Pasirlangu melayani warga setiap hari Senin hingga Jumat pukul 08.00 – 15.00 WIB. Layanan ditutup pada hari Sabtu, Minggu, dan hari libur nasional.'
          },
          {
            q: 'Apakah seluruh layanan administrasi di balai desa dipungut biaya?',
            a: 'Tidak. Seluruh layanan administrasi kependudukan di tingkat desa bersifat GRATIS tanpa pungutan biaya apa pun sesuai ketentuan peraturan perundang-undangan yang berlaku.'
          },
          {
            q: 'Bagaimana cara mengurus Surat Keterangan Domisili Usaha (SKDU)?',
            a: 'Siapkan KTP, KK, Surat Pengantar dari RT/RW, dan foto lokasi usaha. Bawa ke loket Balai Desa pada jam kerja. Surat akan selesai di hari yang sama atau paling lambat 1 hari kerja.'
          },
          {
            q: 'Bagaimana cara mendaftarkan produk UMKM ke platform digital desa?',
            a: 'Hubungi tim BUMDes Pasirlangu melalui nomor WhatsApp yang tertera di halaman Kontak. Produk akan dikurasi dan difoto sebelum ditayangkan di katalog digital resmi desa.'
          },
          {
            q: 'Bagaimana cara melaporkan kerusakan infrastruktur atau fasilitas umum?',
            a: 'Laporan dapat disampaikan langsung ke Kepala Dusun setempat, melalui grup WhatsApp RT/RW, atau via formulir pengaduan di halaman Layanan Mandiri pada website ini.'
          },
          {
            q: 'Di mana saya bisa melihat realisasi anggaran desa (APBDes)?',
            a: 'Dokumen APBDes tersedia secara terbuka di halaman Transparansi APBDes pada website ini, serta ditempelkan di papan informasi Balai Desa.'
          }
        ]
      }
    },

    // ──────────────────────────────────────────────────────────
    // 13. CTA BANNER (MasterCtaBanner)
    //     Ajakan untuk menghubungi pemerintah desa.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-cta',
      type: 'cta_banner',
      data: {
        title: 'Bersama Wujudkan Pasirlangu yang Lebih Baik',
        subtitle:
          'Sampaikan aspirasi, laporan, dan pertanyaan Anda kepada kami. Pemerintah Desa Pasirlangu hadir untuk mendengar dan melayani seluruh warga dengan sepenuh hati.',
        buttonText: 'Hubungi Kami Sekarang',
        buttonUrl: '/p/kontak'
      }
    },

    // ──────────────────────────────────────────────────────────
    // 14. CONTACT FORM (MasterContactForm)
    //     Form pengaduan dan kontak yang terhubung ke WhatsApp.
    // ──────────────────────────────────────────────────────────
    {
      id: 'block-kontak',
      type: 'contact_form',
      data: {
        sectionBadge: 'LAYANAN DIGITAL CEPAT',
        title: 'Pusat Bantuan & Pengaduan Warga',
        subtitle:
          'Sampaikan aspirasi, pertanyaan, atau permohonan informasi layanan secara langsung. Tim Admin Desa Pasirlangu akan merespons melalui WhatsApp pada jam kerja.',
        whatsappNumber: '6281234567890', // ⚠️ Ganti dengan nomor WA resmi Desa Pasirlangu
        buttonText: 'Kirim ke Admin Desa'
      }
    }

  ];

  // ============================================================
  // EKSEKUSI UPSERT KE DATABASE
  // ============================================================
  const landingPage = await prisma.page.upsert({
    where: { slug: 'beranda' },
    update: {
      title: 'Beranda – Desa Pasirlangu, Kec. Cisarua, Bandung Barat',
      content: JSON.stringify(homeContent),
      status: PostStatus.PUBLISHED,
      updatedAt: new Date()
    },
    create: {
      title: 'Beranda – Desa Pasirlangu, Kec. Cisarua, Bandung Barat',
      slug: 'beranda',
      content: JSON.stringify(homeContent),
      status: PostStatus.PUBLISHED,
      authorId: authorId,
      publishedAt: new Date()
    }
  });

  console.log(`✅ Beranda sukses ter-seed! ID Page: ${landingPage.id}`);
  console.log('📦 Total blok builder yang di-seed: 14 section');
  console.log('');
  console.log('📋 Daftar blok yang berhasil dibuat:');
  console.log('    1. hero_banner           — Slider 3 slide + 4 quick links');
  console.log('    2. about_section         — Profil singkat + gambar kapsul desa');
  console.log('    3. dashboard             — Statistik: populasi, luas, UMKM');
  console.log('    4. core_values_grid      — Visi, Misi, 6 Nilai Inti');
  console.log('    5. strategic_sectors     — 4 Potensi unggulan (kartu daun)');
  console.log('    6. carousel_cards        — 5 Destinasi wisata (horizontal scroll)');
  console.log('    7. flow                  — 4 Langkah alur pelayanan publik');
  console.log('    8. product_catalog       — Katalog UMKM (live dari database)');
  console.log('    9. newsroom_section      — Berita terkini (live dari database)');
  console.log('   10. gallery              — 4 Foto kegiatan desa (masonry grid)');
  console.log('   11. certifications_awards — 6 Prestasi & penghargaan');
  console.log('   12. faq                  — 6 Pertanyaan umum warga (accordion)');
  console.log('   13. cta_banner           — Banner ajakan kontak pemerintah desa');
  console.log('   14. contact_form         — Form pengaduan → WhatsApp');
  console.log('');
  console.log('⚠️  PENTING: Ganti nomor WhatsApp di block-kontak dengan nomor resmi desa!');
  console.log('🚀 Refresh frontend untuk melihat hasilnya.');
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });