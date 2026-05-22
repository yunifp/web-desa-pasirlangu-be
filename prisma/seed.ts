import { PrismaClient, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding untuk Halaman Profil CV Perminas...');

  // 1. HARUS ADA USER (Author)
  // Berdasarkan schema.prisma, model Page mewajibkan authorId (author User @relation(...))
  let adminUser = await prisma.user.findFirst({
    where: { email: 'admin@perminas.com' }
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin Perminas',
        email: 'admin@perminas.com',
        password: 'hashed_password_seeder', // Dummy password untuk kebutuhan seed
      }
    });
  }

  // 2. HARUS ADA TEMPLATE
  // Berdasarkan schema.prisma, tidak ada field "templateType", melainkan relasi templateId ke model Template
  let defaultTemplate = await prisma.template.findUnique({
    where: { slug: 'layout-halaman-statis' }
  });

  if (!defaultTemplate) {
    defaultTemplate = await prisma.template.create({
      data: {
        name: 'Layout Halaman Statis',
        slug: 'layout-halaman-statis',
        description: 'Template default untuk halaman statis builder'
      }
    });
  }

  // 3. BLOK KONTEN HALAMAN (Sintaks Typo visionDesc telah diperbaiki)
  const pageContentBlocks = [
    {
      id: "profile_hero-1715000000001",
      type: "profile_hero",
      data: {
        breadcrumb: "Profil Perusahaan",
        badge: "BUMN Strategis Danantara",
        title: "CV Perusahaan Mineral Nasional",
        description: "Entitas berdaulat penggerak hilirisasi logam tanah jarang (*rare earth elements*) dan mineral kritis demi mewujudkan ketahanan rantai pasok teknologi tingkat tinggi masa depan."
      }
    },
    {
      id: "mandate_history-1715000000002",
      type: "mandate_history",
      data: {
        titleHtml: "Kami berpegang pada <strong class=\"font-black text-[#0B4028]\">tujuan</strong> sebagai fondasi, dan menatap masa depan sebagai arah <strong class=\"font-black text-[#0B4028]\">visi</strong> kami",
        desc1: "CV Perusahaan Mineral Nasional (Perminas) menjalankan mandat strategis negara dalam mengelola Badan Usaha Milik Negara (BUMN) sektor ekstraksi, dan mengoordinasikan antara Holding Operasional Logam Tanah Jarang serta Holding Investasi guna memastikan kegiatan operasional dan pemurnian selaras serta terlaksana secara efektif.",
        desc2: "Konsolidasi rantai pasok dari hulu ke hilir menjamin kedaulatan cadangan kritis nusantara untuk mendukung lompatan teknologi mutakhir di bawah naungan ekosistem Danantara.",
        youtubeId: "BMyw1deZ17c",
        watermark: "CV Perminas",
        quote: "Kedaulatan daya anagata nusantara melalui optimasi mineral kritis."
      }
    },
    {
      id: "core_values_grid-1715000000003",
      type: "core_values_grid",
      data: {
        visionBadge: "Cita-Cita Utama",
        visionTitle: "Visi Perminas",
        visionDesc: "Menjadi korporasi pengelola mineral strategis dan logam tanah jarang berkelas dunia yang memimpin rantai pasok semikonduktor serta ekosistem energi ramah lingkungan.",
        visionTarget: "Kedaulatan Hilirisasi Penuh",
        missionBadge: "Peta Jalan Operasional",
        missionTitle: "Misi Strategis Korporasi",
        missions: [
          { text: "Eksplorasi dan ekstraksi cadangan monasit serta xenotim secara terukur dan presisi." },
          { text: "Pembangunan kemandirian fasilitas pemurnian (smelter) mutakhir di dalam negeri." },
          { text: "Integrasi produk material magnet NdFeB ke rantai pasok ekosistem global EV." },
          { text: "Penerapan prinsip tata kelola perusahaan yang bersih di bawah supervisi Danantara." }
        ],
        valuesBadge: "Landasan Budaya Kerja",
        valuesTitle: "Nilai-Nilai Inti Korporasi",
        valuesDesc: "Prinsip moral yang menjiwai setiap insan Perminas dalam mengoperasikan aset strategis negara.",
        coreValues: [
          { title: "Amanah", desc: "Memegang teguh kepercayaan dan mandat ekstraksi mineral kritis negara dengan integritas moral dan transparansi absolut.", iconType: "shield" },
          { title: "Kompeten", desc: "Terus mengasah kepakaran teknis dalam bidang pemurnian logam tanah jarang demi mencapai tingkat kemurnian tertinggi.", iconType: "award" },
          { title: "Harmonis", desc: "Saling peduli dan menghargai keragaman dalam ekosistem operasional serta mengutamakan keselamatan kerja masyarakat.", iconType: "users" },
          { title: "Loyal", desc: "Berdedikasi dan mengutamakan kepentingan bangsa di atas segalanya guna mewujudkan kedaulatan rantai pasok global.", iconType: "target" },
          { title: "Adaptif", desc: "Cepat menyesuaikan diri menghadapi dinamika pasar teknologi tinggi dan terus berinovasi dalam tumpukan metode ekstraksi.", iconType: "zap" },
          { title: "Kolaboratif", desc: "Mendorong sinergi berkelanjutan di bawah supervisi BPI Danantara serta membangun kemitraan strategis mancanegara.", iconType: "compass" }
        ]
      }
    },
    {
      id: "leadership_team-1715000000004",
      type: "leadership_team",
      data: {
        badge: "Kepemimpinan Korporat",
        title: "Jajaran Manajemen CV Perminas",
        period: "Periode Masa Bakti 2025 - 2030",
        commissaries: [
          { name: "Prof. Dr. H. Irwan Darmansyah, M.Sc.", role: "Komisaris Utama", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop", url: "#" },
          { name: "Dr. Rina Anagata, S.T., M.B.A.", role: "Komisaris Independen", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop", url: "#" }
        ],
        directors: [
          { name: "Ir. Ahmad Perminas, M.Eng.", role: "Direktur Utama", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop", url: "#" },
          { name: "Budi Satria Nusantara, C.F.A.", role: "Direktur Keuangan & Strategi", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop", url: "#" },
          { name: "Dr. Eng. Hendra Rare Earth, S.Si.", role: "Direktur Operasi & Smelter", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop", url: "#" }
        ]
      }
    },
    {
      id: "governance_structure-1715000000005",
      type: "governance_structure",
      data: {
        badge: "Skema Hierarki",
        title: "Struktur Organisasi & Tata Kelola",
        desc: "Garis komando pertanggungjawaban mutlak yang menjamin efisiensi dan transparansi pengelolaan modal ventura negara.",
        topBadge: "Supervisi Kelembagaan",
        topTitle: "BPI Danantara",
        topDesc: "Badan Pengelola Investasi Negara",
        midTitle: "Dewan Komisaris",
        midDesc: "Pengawas & Penasihat Strategi",
        botBadge: "Pelaksana Mandat Eksekutif",
        botTitle: "Direksi CV Perminas",
        botDesc: "Mengelola seluruh klaster fasilitas ekstraksi, pemurnian smelter, dan integrasi rantai pasok EV."
      }
    },
    {
      id: "certifications_awards-1715000000006",
      type: "certifications_awards",
      data: {
        title: "Sertifikasi Mutu & Penghargaan",
        description: "Pencapaian kepatuhan standar internasional yang memastikan produk oksida tanah jarang olahan Perminas diakui sah oleh raksasa semikonduktor dunia.",
        certs: [
          { title: "ISO 9001:2015", desc: "Sistem Manajemen Mutu Ekstraksi LTJ" },
          { title: "ISO 14001:2015", desc: "Manajemen Lingkungan & Limbah Smelter" },
          { title: "ISO 45001:2018", desc: "Keselamatan & Kesehatan Kerja Tambang" },
          { title: "PROPER Emas 2026", desc: "Kepatuhan Lingkungan Tertinggi KLHK" }
        ]
      }
    }
  ];

  // 4. MASUKKAN KE TABEL PAGE DENGAN STRUKTUR SCHEMA YANG TEPAT
  const profilePage = await prisma.page.upsert({
    where: { slug: 'profil-perusahaan' },
    update: {
      title: 'Profil Perusahaan CV Perminas',
      content: JSON.stringify(pageContentBlocks),
      status: PostStatus.PUBLISHED, // Enum PostStatus
      authorId: adminUser.id,       // Relasi User
      templateId: defaultTemplate.id, // Relasi Template
    },
    create: {
      title: 'Profil Perusahaan CV Perminas',
      slug: 'profil-perusahaan',
      content: JSON.stringify(pageContentBlocks),
      status: PostStatus.PUBLISHED, // Enum PostStatus
      authorId: adminUser.id,       // Relasi User
      templateId: defaultTemplate.id, // Relasi Template
    },
  });

  console.log(`Seeder selesai. Halaman direkam: ${profilePage.title} (Slug: ${profilePage.slug})`);
}

main()
  .catch((e) => {
    console.error('Error saat menjalankan seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });