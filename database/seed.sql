-- ============================================================
-- SEED DATA: Weaponized AI E-Learning Platform
-- Source: Calvin Nobles (2024), Procedia Computer Science 239
-- ============================================================
-- ─── 1. CLEAR EXISTING DATA ──────────────────────────────────
TRUNCATE TABLE chat_messages, chat_sessions, content_blocks, sections, users RESTART IDENTITY CASCADE;
-- ─── 2. ADMIN USER ───────────────────────────────────────────
-- Password: admin123 (bcrypt hash)
INSERT INTO users (nama, email, password, role) VALUES
(
    'Administrator',
    'admin@weapai.edu',
    '$2a$10$IGyHeqpQzQA.sztOGk0sMuw0M6T.vtRlICVvZX5r36mfyTg6tDGQO',
    'admin'
);
-- ─── 3. SECTIONS ─────────────────────────────────────────────
INSERT INTO sections (judul_bagian, urutan) VALUES
('Latar Belakang & Konsep Kunci', 1),
('Metodologi Systematic Review', 2),
('9 Kategori Ancaman Weaponized AI', 3),
('Analisis RQ1–RQ3', 4),
('Kesimpulan & Refleksi', 5);
-- ─── 4. SECTION 1: LATAR BELAKANG ────────────────────────────
INSERT INTO content_blocks (section_id, judul_sub, konten, urutan) VALUES
(
    1,
    'Apa Itu Weaponized AI?',
    '<p><strong>Weaponized AI</strong> merujuk pada penggunaan algoritma yang dirancang untuk melemahkan performa atau mengganggu operasi normal algoritma AI yang seharusnya digunakan untuk tujuan benign (tidak berbahaya).</p>
<p>Weaponization AI dapat menciptakan skenario serangan yang menguntungkan pelaku kejahatan — baik pada <strong>domain digital</strong> maupun <strong>domain fisik</strong>.</p>
<div class="callout callout-warning">
  <strong>Definisi Inti:</strong> AI yang di-weaponize bukan sekadar AI yang digunakan untuk kejahatan, melainkan AI yang secara spesifik dirancang atau dimodifikasi untuk menyerang atau melemahkan sistem AI lain.
</div>',
    1
),
(
    1,
    'Kelemahan Algoritma AI/ML',
    '<p>Algoritma Artificial Intelligence dan Machine Learning memiliki kelemahan inheren yang membuatnya rentan terhadap serangan:</p>
<ul>
  <li><strong>Ketergantungan pada data training</strong> — kualitas prediksi bergantung sepenuhnya pada kualitas data.</li>
  <li><strong>Black-box nature</strong> — banyak model AI sulit dipahami cara kerjanya secara internal.</li>
  <li><strong>Sensitivitas terhadap input</strong> — small perturbations pada input dapat menyebabkan prediksi yang sangat berbeda (adversarial examples).</li>
  <li><strong>Overfitting</strong> — model yang terlalu fit terhadap training data menjadi mudah dieksploitasi.</li>
  <li><strong>Kurangnya mekanisme verifikasi</strong> — sulit memverifikasi apakah model berjalan sebagaimana dimaksud.</li>
</ul>
<p>Kelemahan-kelemahan ini menjadi pintu masuk bagi pelaku yang ingin menyalahgunakan AI.</p>',
    2
),
(
    1,
    'Duality of Technology',
    '<p>Teknologi memiliki sifat <strong>dual-use</strong> — teknologi yang awalnya dibuat untuk tujuan baik dapat dimodifikasi, disalahgunakan, atau digunakan untuk tujuan berbahaya.</p>
<div class="row g-3 mt-2">
  <div class="col-md-6">
    <div class="card border-0 bg-success bg-opacity-10 p-3 rounded-3">
      <h6 class="text-success">🛡️ AI untuk Defense</h6>
      <ul class="mb-0 small">
        <li>Threat detection otomatis</li>
        <li>Analisis malware</li>
        <li>Anomaly detection</li>
        <li>Real-time incident response</li>
      </ul>
    </div>
  </div>
  <div class="col-md-6">
    <div class="card border-0 bg-danger bg-opacity-10 p-3 rounded-3">
      <h6 class="text-danger">⚔️ AI untuk Offense</h6>
      <ul class="mb-0 small">
        <li>Advanced malware</li>
        <li>Social engineering canggih</li>
        <li>Data poisoning</li>
        <li>Evasion techniques</li>
      </ul>
    </div>
  </div>
</div>
<p class="mt-3">Dualitas ini adalah inti dari kajian Nobles: AI bukan sekadar alat pertahanan, melainkan juga potensi senjata yang terus berkembang.</p>',
    3
),
(
    1,
    'Studi Kasus: Microsoft Tay Chatbot',
    '<p><strong>Microsoft Tay</strong> adalah chatbot AI yang diluncurkan pada tahun 2016. Dalam waktu kurang dari 24 jam, Tay berubah menjadi chatbot yang menghasilkan konten bermasalah dan ofensif.</p>
<div class="callout callout-danger">
  <strong>Apa yang terjadi?</strong> Pengguna secara kolektif dan terkoordinasi memberikan <em>malicious inputs</em> kepada Tay, memanfaatkan kemampuan Tay untuk belajar dari percakapan. Hasilnya, Tay mulai menghasilkan respons yang tidak pantas.
</div>
<p>Studi kasus ini mendemonstrasikan:</p>
<ul>
  <li>AI dapat dipengaruhi dan dimanipulasi melalui input yang dirancang dengan sengaja.</li>
  <li>Sistem AI yang terhubung ke publik rentan terhadap serangan terkoordinasi.</li>
  <li>Tanpa mekanisme perlindungan yang memadai, AI dapat diubah menjadi alat yang merugikan.</li>
  <li>Kebutuhan akan ethical design dan safeguards dalam deployment AI.</li>
</ul>
<p>Tay menjadi salah satu contoh paling ikonik tentang bagaimana weaponization AI dapat terjadi dalam konteks nyata.</p>',
    4
),
(
    1,
    'Hubungan AI dengan Cybersecurity',
    '<p>AI dan cybersecurity memiliki hubungan yang saling mempengaruhi:</p>
<ul>
  <li><strong>AI meningkatkan cybersecurity</strong> — melalui otomasi deteksi ancaman, analisis pola serangan, dan respons insiden yang lebih cepat.</li>
  <li><strong>AI menciptakan ancaman baru</strong> — teknik AI digunakan oleh pelaku untuk mengembangkan serangan yang lebih canggih dan sulit dideteksi.</li>
  <li><strong>AI systems menjadi target</strong> — AI systems sendiri menjadi sasaran serangan, bukan hanya alat.</li>
</ul>
<p>Kajian Nobles menyoroti bahwa <em>arms race</em> antara offensive AI dan defensive AI sedang berlangsung di lanskap cybersecurity modern.</p>',
    5
),
(
    1,
    'Konteks dan Latar Belakang Penelitian',
    '<p>Penelitian Calvin Nobles bertujuan mengeksplorasi bagaimana AI dapat di-weaponize dan implikasinya terhadap cybersecurity. Kajian ini diterbitkan dalam:</p>
<div class="callout callout-info">
  <strong>Publikasi:</strong> Procedia Computer Science, Volume 239 (2024), halaman 547–555<br>
  <strong>Judul:</strong> "The Weaponization of Artificial Intelligence in Cybersecurity: A Systematic Review"<br>
  <strong>Author:</strong> Calvin Nobles
</div>
<p>Penelitian ini penting karena:</p>
<ul>
  <li>Memberikan tinjauan sistematis terhadap literatur yang ada mengenai weaponized AI.</li>
  <li>Mengidentifikasi kategori ancaman secara terstruktur.</li>
  <li>Memetakan strategi mitigasi yang direkomendasikan oleh komunitas peneliti.</li>
  <li>Mengidentifikasi celah penelitian yang masih perlu dieksplorasi.</li>
</ul>',
    6
);
-- ─── 5. SECTION 2: METODOLOGI ────────────────────────────────
INSERT INTO content_blocks (section_id, judul_sub, konten, urutan) VALUES
(
    2,
    'Pendekatan Systematic Review',
    '<p>Penelitian ini menggunakan metodologi <strong>Systematic Review</strong> untuk:</p>
<ul>
  <li>Mengidentifikasi literatur yang relevan secara sistematis.</li>
  <li>Mengevaluasi kualitas penelitian yang ada.</li>
  <li>Menginterpretasikan hasil dari berbagai studi.</li>
  <li>Menggabungkan temuan dari berbagai sumber.</li>
  <li>Menemukan <em>research gaps</em> yang masih perlu diteliti.</li>
</ul>
<p>Systematic review dipilih karena kemampuannya untuk memberikan gambaran komprehensif dan objektif terhadap body of knowledge yang ada pada suatu topik penelitian.</p>',
    1
),
(
    2,
    '3 Research Questions (RQ)',
    '<p>Penelitian dilandasi oleh <strong>3 Research Questions</strong> utama:</p>
<div class="card border-0 bg-primary bg-opacity-10 p-3 mb-3 rounded-3">
  <h6 class="text-primary">RQ1</h6>
  <p class="mb-1"><em>"Is there an observed connection between weaponizing AI and countermeasures in cybersecurity in existing literature?"</em></p>
  <small class="text-muted">Mengidentifikasi hubungan antara AI-driven attacks dan cybersecurity countermeasures.</small>
</div>
<div class="card border-0 bg-info bg-opacity-10 p-3 mb-3 rounded-3">
  <h6 class="text-info">RQ2</h6>
  <p class="mb-1"><em>"What mitigation strategies are mentioned in the literature for addressing the weaponization of AI in cybersecurity?"</em></p>
  <small class="text-muted">Mengidentifikasi strategi untuk menghadapi AI-driven attacks.</small>
</div>
<div class="card border-0 bg-warning bg-opacity-10 p-3 rounded-3">
  <h6 class="text-warning">RQ3</h6>
  <p class="mb-1"><em>"In what ways are AI-driven attacks influencing cybersecurity?"</em></p>
  <small class="text-muted">Mengidentifikasi bagaimana AI-driven attacks memengaruhi preparation, defense, dan response cybersecurity.</small>
</div>',
    2
),
(
    2,
    'Database dan Sumber Literatur',
    '<p>Penelitian menggunakan beberapa database akademik utama:</p>
<ul>
  <li><strong>Scopus</strong> — database utama, dipilih karena jangkauannya yang luas dan overlap dengan database lain</li>
  <li><strong>Springer</strong></li>
  <li><strong>IEEE</strong></li>
  <li><strong>Wiley</strong></li>
  <li><strong>ACM</strong></li>
  <li><strong>Google Scholar</strong></li>
</ul>
<div class="callout callout-info">
  <strong>Mengapa Scopus?</strong> Web of Science tidak tersedia, sehingga Scopus dipilih sebagai repositori besar untuk peer-reviewed English-language literature yang memiliki overlap dengan database lainnya.
</div>',
    3
),
(
    2,
    'Kriteria Inklusi, Eksklusi, dan Eligibilitas',
    '<h6 class="text-success">✅ Inclusion Criteria</h6>
<ul>
  <li>Peer-reviewed journal article mengenai weaponizing AI atau AI-driven attacks dalam cybersecurity.</li>
  <li>Peer-reviewed book chapter mengenai topik tersebut.</li>
  <li>Berbahasa Inggris.</li>
  <li>Berkaitan dengan research questions.</li>
</ul>
<h6 class="text-danger mt-3">❌ Exclusion Criteria</h6>
<ul>
  <li>Non-peer-reviewed journal articles.</li>
  <li>Books dan non-peer-reviewed articles.</li>
  <li>Artikel yang tidak berhubungan dengan research questions.</li>
  <li>Artikel duplikat dari database berbeda.</li>
</ul>
<h6 class="text-primary mt-3">🔍 Eligibility Criteria</h6>
<ul>
  <li>Dapat diakses melalui database/journal yang dipilih.</li>
  <li>Ditulis dalam bahasa Inggris.</li>
  <li>Menjelaskan metodologi penelitian.</li>
  <li>Menyediakan data untuk analisis.</li>
  <li>Sudah selesai (bukan ongoing).</li>
  <li>Tidak duplikat.</li>
  <li>Memberikan insight tentang weaponization AI dalam cybersecurity.</li>
</ul>',
    4
),
(
    2,
    'Quality Assessment',
    '<p>Setiap artikel dinilai menggunakan <strong>Likert-based quality assessment</strong> dengan empat kriteria:</p>
<ol>
  <li>Apakah artikel cukup menjawab sebagian besar research inquiries?</li>
  <li>Apakah weaponization AI dan AI-driven assaults dibahas dengan cukup?</li>
  <li>Apakah publikasi menawarkan solusi atau insight terhadap research questions?</li>
  <li>Apakah metodologi penelitian dijelaskan dengan benar?</li>
</ol>
<p>Kategori penilaian:</p>
<div class="d-flex gap-2 flex-wrap mt-2">
  <span class="badge bg-danger px-3 py-2">Poor</span>
  <span class="badge bg-warning text-dark px-3 py-2">Regular</span>
  <span class="badge bg-info px-3 py-2">Good</span>
  <span class="badge bg-success px-3 py-2">Very Good</span>
</div>
<p class="mt-3">Dari 21 studi yang lolos seleksi:</p>
<ul>
  <li><strong>Very Good:</strong> 6 artikel</li>
  <li><strong>Good:</strong> 11 artikel</li>
  <li><strong>Regular:</strong> 3 artikel</li>
  <li><strong>Poor:</strong> 1 artikel</li>
</ul>',
    5
),
(
    2,
    'Study Selection Process',
    '<p>Proses seleksi studi berlangsung dalam beberapa tahap:</p>
<ol>
  <li><strong>Identification:</strong> 118 records teridentifikasi dari berbagai database.</li>
  <li><strong>Screening (Title & Abstract):</strong> Tersisa 97 artikel setelah screening judul dan abstrak.</li>
  <li><strong>Introduction & Conclusion Screening:</strong> Tersisa 56 artikel.</li>
  <li><strong>Full-Text Eligibility Assessment:</strong> Tersisa 38 artikel.</li>
  <li><strong>Final Selected Studies:</strong> 21 artikel lolos seleksi akhir.</li>
</ol>
<div class="callout callout-info">
  <strong>Duplikat dihapus:</strong> 21 artikel duplikat dihapus selama proses screening. Records yang diexclude: 41 (screening 1), 18 (screening 2), dan 17 (full-text eligibility).
</div>',
    6
),
(
    2,
    'Distribusi Sumber dan Jenis Publikasi',
    '<p>Dari 21 artikel final yang dipilih, distribusi berdasarkan sumber:</p>
<ul>
  <li><strong>Google Scholar:</strong> 7 artikel</li>
  <li><strong>IEEE:</strong> 4 artikel</li>
  <li><strong>Springer:</strong> 3 artikel</li>
  <li><strong>Scopus:</strong> 3 artikel</li>
  <li><strong>Wiley:</strong> 2 artikel</li>
  <li><strong>ACM:</strong> 2 artikel</li>
</ul>
<p><strong>Jenis publikasi:</strong></p>
<ul>
  <li>Peer-reviewed journals: 11</li>
  <li>Conference / symposium proceedings: 9</li>
  <li>Peer-reviewed book chapter: 1</li>
</ul>
<p><strong>Distribusi tahun publikasi:</strong> 2017 (1), 2018 (1), 2019 (4), 2020 (4), 2021 (3), 2022 (6), 2023 (2).</p>',
    7
);
-- ─── 6. SECTION 3: KATEGORI ANCAMAN ──────────────────────────
INSERT INTO content_blocks (section_id, judul_sub, konten, urutan) VALUES
(
    3,
    'Pengantar: 9 Kategori Ancaman',
    '<p>Kajian Nobles mengidentifikasi <strong>9 kategori ancaman utama</strong> yang berkaitan dengan weaponization AI dalam konteks cybersecurity. Setiap kategori merepresentasikan area di mana AI dapat disalahgunakan atau menjadi target serangan.</p>
<div class="callout callout-warning">
  <strong>Penting:</strong> Istilah dan pengelompokan kategori ini mengikuti kajian Nobles secara persis. Kategori-kategori ini tidak dimodifikasi atau diganti dengan sumber lain.
</div>
<p>Memahami 9 kategori ini sangat penting untuk mengembangkan strategi mitigasi yang efektif dan komprehensif.</p>',
    1
),
(
    3,
    'Kategori 1: AI/ML Contamination or Manipulated Algorithm',
    '<h6 class="text-danger">⚠️ AI/ML Contamination or Manipulated Algorithm</h6>
<p>Manipulasi dataset machine learning dapat mengubah prediksi algoritma secara drastis sehingga menghasilkan hasil yang salah atau merugikan, termasuk <strong>false positives</strong>.</p>
<p>Serangan dalam kategori ini mencakup:</p>
<ul>
  <li><strong>Data poisoning</strong> — memasukkan data berbahaya ke dalam dataset training.</li>
  <li><strong>Label flipping</strong> — mengubah label pada data training untuk menyesatkan model.</li>
  <li><strong>Backdoor attacks</strong> — menyisipkan "pintu belakang" dalam model saat training.</li>
  <li><strong>Adversarial perturbations</strong> — modifikasi kecil pada input yang menyebabkan kesalahan prediksi.</li>
</ul>
<p>Akibat dari serangan ini dapat sangat serius, terutama ketika AI digunakan dalam sistem kritis seperti deteksi intrusi, diagnosis medis, atau sistem keamanan.</p>',
    2
),
(
    3,
    'Kategori 2: AI-Powered Malware',
    '<h6 class="text-danger">⚠️ AI-Powered Malware</h6>
<p><strong>Deep learning</strong> dapat digunakan untuk meningkatkan kemampuan malware agar lebih autonomous, sophisticated, dan elusive (sulit dideteksi).</p>
<p>Kemampuan yang dimiliki AI-powered malware meliputi:</p>
<div class="row g-2 mt-1">
  <div class="col-md-6"><div class="card border-danger border-opacity-25 bg-danger bg-opacity-10 p-2 rounded-3 h-100"><small><strong>Probing</strong> — menyelidiki target secara otomatis</small></div></div>
  <div class="col-md-6"><div class="card border-danger border-opacity-25 bg-danger bg-opacity-10 p-2 rounded-3 h-100"><small><strong>Scanning</strong> — memindai kerentanan</small></div></div>
  <div class="col-md-6"><div class="card border-danger border-opacity-25 bg-danger bg-opacity-10 p-2 rounded-3 h-100"><small><strong>Spoofing</strong> — menyamar sebagai entitas tepercaya</small></div></div>
  <div class="col-md-6"><div class="card border-danger border-opacity-25 bg-danger bg-opacity-10 p-2 rounded-3 h-100"><small><strong>Flooding</strong> — membanjiri sistem target</small></div></div>
  <div class="col-md-6"><div class="card border-danger border-opacity-25 bg-danger bg-opacity-10 p-2 rounded-3 h-100"><small><strong>Misdirection</strong> — mengalihkan perhatian defender</small></div></div>
  <div class="col-md-6"><div class="card border-danger border-opacity-25 bg-danger bg-opacity-10 p-2 rounded-3 h-100"><small><strong>Execution</strong> — eksekusi payload secara otomatis</small></div></div>
</div>
<p class="mt-3">Tujuannya adalah membantu malware melewati <strong>cyber defenses</strong> tradisional yang berbasis signature atau rule-based detection.</p>',
    3
),
(
    3,
    'Kategori 3: AI-Induced Vulnerabilities',
    '<h6 class="text-danger">⚠️ AI-Induced Vulnerabilities</h6>
<p>Penggunaan AI itu sendiri dapat menciptakan atau memperbesar kerentanan keamanan yang ada. Risiko meningkat akibat:</p>
<ul>
  <li><strong>Menurunnya system autonomy</strong> — ketergantungan berlebih pada AI mengurangi kontrol manusia.</li>
  <li><strong>Erosi data privacy</strong> — AI membutuhkan data masif yang meningkatkan risiko pelanggaran privasi.</li>
  <li><strong>Regulasi AI yang buruk</strong> — ketidakjelasan aturan menciptakan celah yang dapat dieksploitasi.</li>
  <li><strong>Vulnerable cyber-physical systems</strong> — AI dalam sistem fisik (IoT, infrastruktur) membuka permukaan serangan baru.</li>
  <li><strong>Self-learning attacks</strong> — serangan yang beradaptasi dan belajar dari respons defender.</li>
  <li><strong>Deceptive tactics</strong> — teknik yang memanipulasi persepsi sistem AI.</li>
</ul>',
    4
),
(
    3,
    'Kategori 4: Weaponization of Code',
    '<h6 class="text-danger">⚠️ Weaponization of Code</h6>
<p>Kategori ini berkaitan dengan masalah <strong>kontrol dan deployment code</strong> yang dapat mempermudah proliferasi pembuatan <em>cyberweapons</em>.</p>
<p>Aspek-aspek yang menjadi perhatian:</p>
<ul>
  <li>AI dapat digunakan untuk menghasilkan kode berbahaya secara otomatis.</li>
  <li>Code obfuscation menggunakan AI membuat kode berbahaya sulit dideteksi.</li>
  <li>Automated vulnerability discovery mempercepat eksploitasi celah keamanan.</li>
  <li>Proliferasi cyberweapons menjadi lebih mudah dengan bantuan AI generatif.</li>
</ul>',
    5
),
(
    3,
    'Kategori 5: Weaponization of Disinformation and Social Media',
    '<h6 class="text-danger">⚠️ Weaponization of Disinformation and Social Media</h6>
<p>AI, algoritma, automation, SPAM, dan <strong>domain generation algorithms</strong> dapat digunakan untuk menyebarkan manipulated information secara efisien dan luas.</p>
<p>Teknik-teknik yang digunakan:</p>
<ul>
  <li><strong>Deepfake</strong> — membuat konten video/audio palsu yang sangat meyakinkan.</li>
  <li><strong>Automated content generation</strong> — menghasilkan disinformasi dalam skala besar.</li>
  <li><strong>Social media manipulation</strong> — menggunakan bot AI untuk memengaruhi opini publik.</li>
  <li><strong>Domain generation algorithms</strong> — membuat domain palsu secara otomatis untuk penyebaran disinformasi.</li>
  <li><strong>Targeted misinformation</strong> — menyesuaikan disinformasi berdasarkan profil psikologis target.</li>
</ul>',
    6
),
(
    3,
    'Kategori 6: AI-Driven Attacks',
    '<h6 class="text-danger">⚠️ AI-Driven Attacks</h6>
<p>Berkaitan dengan metode dan taktik untuk menghindari atau melawan <strong>cyber kill chain</strong> — model yang menggambarkan tahapan serangan siber.</p>
<p>AI-driven attacks memiliki karakteristik:</p>
<ul>
  <li><strong>Automation</strong> — serangan berjalan secara otomatis tanpa intervensi manusia.</li>
  <li><strong>Scalability</strong> — dapat menargetkan banyak sistem secara bersamaan.</li>
  <li><strong>Adaptability</strong> — belajar dan beradaptasi berdasarkan respons target.</li>
  <li><strong>Advanced Persistent Threats (APT)</strong> — serangan jangka panjang yang sulit dideteksi.</li>
  <li><strong>Automated phishing</strong> — membuat kampanye phishing yang sangat personal.</li>
</ul>',
    7
),
(
    3,
    'Kategori 7: Security Threats to AI Models',
    '<h6 class="text-danger">⚠️ Security Threats to AI Models</h6>
<p>AI systems sendiri menjadi target serangan. Tiga jenis ancaman utama:</p>
<div class="row g-3 mt-1">
  <div class="col-md-4">
    <div class="card border-0 bg-dark bg-opacity-10 p-3 rounded-3 h-100">
      <h6 class="text-danger">Evasion</h6>
      <p class="small mb-0">Attacker memodifikasi input untuk "menipu" model AI sehingga menghasilkan prediksi yang salah tanpa mengubah model itu sendiri.</p>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card border-0 bg-dark bg-opacity-10 p-3 rounded-3 h-100">
      <h6 class="text-danger">Poisoning</h6>
      <p class="small mb-0">Memasukkan data berbahaya ke dalam training set sehingga model yang dihasilkan memiliki perilaku yang tidak diinginkan.</p>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card border-0 bg-dark bg-opacity-10 p-3 rounded-3 h-100">
      <h6 class="text-danger">Stealing</h6>
      <p class="small mb-0">Mencuri model AI atau data training melalui black-box examination, membocorkan informasi sensitif atau kekayaan intelektual.</p>
    </div>
  </div>
</div>',
    8
),
(
    3,
    'Kategori 8: Weaponization AI/ML',
    '<h6 class="text-danger">⚠️ Weaponization AI/ML</h6>
<p>AI/ML tactics dapat dirancang secara khusus untuk menghindari <strong>conventional cyber defenses</strong> dan dapat mengarah pada pengembangan <em>autonomous weapon systems</em> dengan konsekuensi yang tidak terduga.</p>
<p>Aspek kritis dari kategori ini:</p>
<ul>
  <li>AI dapat membuat sistem senjata yang beroperasi secara otonom tanpa pengawasan manusia.</li>
  <li>Kemampuan AI untuk bypass traditional defenses menciptakan kesenjangan dalam keamanan.</li>
  <li>Autonomous weapon systems dapat mengambil keputusan yang memiliki konsekuensi nyata di dunia fisik.</li>
  <li>Kurangnya regulasi internasional mengenai AI weapons menjadi tantangan besar.</li>
</ul>',
    9
),
(
    3,
    'Kategori 9: Social Engineering Attacks',
    '<h6 class="text-danger">⚠️ Social Engineering Attacks</h6>
<p>AI dapat digunakan untuk menghasilkan serangan <strong>social engineering</strong> yang semakin sophisticated — menargetkan faktor manusia sebagai titik lemah.</p>
<p>AI meningkatkan kemampuan social engineering melalui:</p>
<ul>
  <li><strong>Hyper-personalization</strong> — menganalisis data korban untuk membuat serangan yang sangat personal.</li>
  <li><strong>Deepfake impersonation</strong> — menyamar sebagai orang tepercaya menggunakan video/audio palsu.</li>
  <li><strong>Automated spear phishing</strong> — membuat email phishing yang sangat meyakinkan secara otomatis.</li>
  <li><strong>Psychological profiling</strong> — menganalisis kelemahan psikologis target untuk meningkatkan success rate.</li>
  <li><strong>Multi-channel attacks</strong> — mengkoordinasikan serangan di berbagai platform secara otomatis.</li>
</ul>',
    10
),
(
    3,
    'Area Tambahan: Network Intrusion & AI-Based Autonomy',
    '<h5>Network Intrusion Evasion</h5>
<p>Malware dirancang khusus untuk menghindari <strong>network detection</strong> — menganalisis pola deteksi dan beradaptasi secara real-time untuk menghindari identifikasi.</p>
<h5 class="mt-3">AI-Based Autonomy Intelligence</h5>
<p>Threat actors meningkatkan kemampuan weapon mereka sehingga menjadi:</p>
<ul>
  <li><strong>Lebih autonomous</strong> — beroperasi tanpa banyak intervensi manusia.</li>
  <li><strong>Lebih sophisticated</strong> — menggunakan teknik yang lebih kompleks dan canggih.</li>
  <li><strong>Lebih sulit dideteksi</strong> — mampu menyembunyikan diri dari sistem monitoring.</li>
</ul>
<p>Kombinasi dari autonomy dan sophistication ini membuat AI-based threats jauh lebih berbahaya dibandingkan malware konvensional.</p>',
    11
);
-- ─── 7. SECTION 4: ANALISIS RQ ───────────────────────────────
INSERT INTO content_blocks (section_id, judul_sub, konten, urutan) VALUES
(
    4,
    'RQ1: Hubungan Weaponizing AI dengan Countermeasures',
    '<h5>RQ1: Is there an observed connection between weaponizing AI and countermeasures in cybersecurity?</h5>
<p><strong>Jawaban:</strong> Ya. Ada hubungan yang jelas antara weaponizing AI dan cybersecurity countermeasures.</p>
<p>AI mengalami <strong>duality</strong>: digunakan untuk menyerang sekaligus untuk bertahan. AI systems sendiri dapat menjadi target serangan.</p>
<h6 class="mt-3">Ancaman terhadap AI mencakup:</h6>
<ul>
  <li>Data poisoning</li>
  <li>Model tampering</li>
  <li>Backdoors</li>
  <li>Evasion attacks</li>
  <li>Model/data theft</li>
</ul>
<h6 class="mt-3">AI-driven attacks mencakup:</h6>
<ul>
  <li>Advanced persistent threats</li>
  <li>Automated phishing</li>
  <li>Deep social engineering</li>
  <li>Malware enhancement</li>
  <li>Code obfuscation</li>
  <li>Adaptive behavior</li>
</ul>
<h6 class="mt-3">AI meningkatkan defensive cybersecurity melalui:</h6>
<ul>
  <li>Threat detection otomatis</li>
  <li>Threat analysis yang lebih akurat</li>
  <li>Threat prediction proaktif</li>
  <li>Attack vector prediction</li>
  <li>Real-time response</li>
</ul>
<div class="callout callout-warning mt-3">
  <strong>Kesimpulan RQ1:</strong> Terjadi semacam <em>arms race</em> antara offensive AI dan defensive AI — setiap peningkatan kemampuan serangan mendorong pengembangan kemampuan pertahanan yang lebih baik, dan sebaliknya.
</div>',
    1
),
(
    4,
    'RQ2: Mitigation Strategies',
    '<h5>RQ2: What mitigation strategies are mentioned in the literature?</h5>
<p>Literatur mengidentifikasi berbagai strategi mitigasi untuk menghadapi weaponization AI:</p>
<ol>
  <li>Kolaborasi antara <strong>policymakers, engineers, dan researchers</strong>.</li>
  <li>Open dialogue mengenai <strong>responsible AI</strong>.</li>
  <li>Kerja sama pemerintah dengan <strong>technology companies</strong>.</li>
  <li>Kerja sama dengan <strong>social media platforms</strong>.</li>
  <li>Pengembangan <strong>filter</strong> untuk mengurangi penyebaran disinformation.</li>
  <li>Penelitian lebih lanjut mengenai <em>scale, scope, origin, veracity, dan distribution</em> of disinformation.</li>
  <li>Meningkatkan <strong>digital literacy</strong>.</li>
  <li>Meningkatkan <strong>media literacy</strong>.</li>
  <li>Kolaborasi pemerintah, media, dan sektor swasta.</li>
  <li>Berbagi <strong>best practices</strong> antar organisasi.</li>
  <li>Mengembangkan cybersecurity systems yang mampu beradaptasi terhadap AI-driven threats.</li>
  <li>Pengembangan dan penggunaan <strong>AI untuk defensive cybersecurity</strong>.</li>
  <li>Ethical design dan ethical deployment AI.</li>
  <li>Regulasi yang tepat terhadap pengembangan dan penggunaan AI.</li>
  <li>Berbagi penelitian countermeasure dalam komunitas information security.</li>
</ol>',
    2
),
(
    4,
    'RQ3: Pengaruh AI-Driven Attacks terhadap Cybersecurity',
    '<h5>RQ3: In what ways are AI-driven attacks influencing cybersecurity?</h5>
<p>AI-driven attacks memengaruhi cybersecurity dengan cara attacker mengeksploitasi vulnerabilities dalam AI systems.</p>
<h6>Contoh serangan konkret:</h6>
<ul>
  <li><strong>Adversarial inputs:</strong> Input dirancang agar model menghasilkan prediksi yang salah.</li>
  <li><strong>Training data poisoning:</strong> Data training dimanipulasi sehingga kemampuan detection menurun.</li>
  <li><strong>Model extraction:</strong> Attacker mencoba merekonstruksi model atau memperoleh informasi training melalui black-box examination.</li>
</ul>
<h6 class="mt-3">AI meningkatkan kemampuan serangan dalam:</h6>
<div class="row g-2 mt-1">
  <div class="col-6 col-md-4"><span class="badge bg-danger w-100 py-2">Automation</span></div>
  <div class="col-6 col-md-4"><span class="badge bg-danger w-100 py-2">Scalability</span></div>
  <div class="col-6 col-md-4"><span class="badge bg-danger w-100 py-2">Complexity</span></div>
  <div class="col-6 col-md-4"><span class="badge bg-danger w-100 py-2">Flexibility</span></div>
  <div class="col-6 col-md-4"><span class="badge bg-danger w-100 py-2">Evasion</span></div>
  <div class="col-6 col-md-4"><span class="badge bg-danger w-100 py-2">Social Engineering</span></div>
</div>
<div class="callout callout-warning mt-3">
  <strong>Risiko:</strong> Blind trust terhadap AI dapat menjadi risiko besar. Masalah lain meliputi: kurangnya transparency, privacy concerns, dependency terhadap AI, loss of human control, unclear ethical decision-making, dan kurangnya legal structures.
</div>',
    3
),
(
    4,
    'Sintesis: Arms Race Antara Offensive dan Defensive AI',
    '<h5>Sintesis Analisis RQ1–RQ3</h5>
<p>Dari ketiga research questions, sebuah tema besar muncul: <strong>arms race</strong> antara offensive AI dan defensive AI.</p>
<div class="row g-3 mt-1">
  <div class="col-md-6">
    <div class="card border-0 bg-danger bg-opacity-10 p-3 rounded-3 h-100">
      <h6 class="text-danger">⚔️ Offensive AI</h6>
      <ul class="small mb-0">
        <li>Malware yang lebih canggih</li>
        <li>Serangan yang lebih otomatis</li>
        <li>Social engineering berbasis AI</li>
        <li>Evasion yang lebih efektif</li>
        <li>Serangan adaptif</li>
      </ul>
    </div>
  </div>
  <div class="col-md-6">
    <div class="card border-0 bg-success bg-opacity-10 p-3 rounded-3 h-100">
      <h6 class="text-success">🛡️ Defensive AI</h6>
      <ul class="small mb-0">
        <li>Deteksi ancaman real-time</li>
        <li>Analisis perilaku otomatis</li>
        <li>Prediksi serangan proaktif</li>
        <li>Response yang lebih cepat</li>
        <li>Sistem adaptif</li>
      </ul>
    </div>
  </div>
</div>
<p class="mt-3">Komunitas keamanan harus bergerak lebih cepat dari para penyerang — yang membutuhkan kolaborasi, regulasi, penelitian, dan pengembangan kemampuan defensive AI yang berkelanjutan.</p>',
    4
);
-- ─── 8. SECTION 5: KESIMPULAN ────────────────────────────────
INSERT INTO content_blocks (section_id, judul_sub, konten, urutan) VALUES
(
    5,
    'Kesimpulan Utama',
    '<p>Kajian Nobles menghasilkan beberapa kesimpulan utama yang kritis:</p>
<div class="callout callout-danger">
  <strong>Kesimpulan Inti:</strong> Weaponization of AI merupakan ancaman signifikan terhadap efektivitas benign AI algorithms dan dapat menciptakan advanced attack scenarios dalam domain digital maupun fisik.
</div>
<p>AI merupakan <strong>double-edged sword</strong> — senjata bermata dua:</p>
<div class="row g-3 mt-2">
  <div class="col-md-6">
    <div class="card border-0 bg-success bg-opacity-10 p-3 rounded-3">
      <h6 class="text-success">🛡️ AI untuk DEFENSE</h6>
      <ul class="small mb-0">
        <li>Meningkatkan threat detection</li>
        <li>Meningkatkan threat analysis</li>
        <li>Meningkatkan response speed</li>
        <li>Automasi cybersecurity</li>
      </ul>
    </div>
  </div>
  <div class="col-md-6">
    <div class="card border-0 bg-danger bg-opacity-10 p-3 rounded-3">
      <h6 class="text-danger">⚔️ AI untuk ATTACK</h6>
      <ul class="small mb-0">
        <li>Meningkatkan kemampuan malware</li>
        <li>Meningkatkan social engineering</li>
        <li>Meningkatkan evasion capabilities</li>
        <li>Memfasilitasi data poisoning</li>
        <li>Meningkatkan automation</li>
        <li>Meningkatkan scalability serangan</li>
      </ul>
    </div>
  </div>
</div>',
    1
),
(
    5,
    'Rekomendasi dan Kolaborasi yang Dibutuhkan',
    '<p>Untuk menghadapi risiko weaponization AI, diperlukan kolaborasi dari berbagai pihak:</p>
<div class="d-flex flex-wrap gap-2 my-3">
  <span class="badge bg-primary px-3 py-2">Policymakers</span>
  <span class="badge bg-primary px-3 py-2">Engineers</span>
  <span class="badge bg-primary px-3 py-2">Researchers</span>
  <span class="badge bg-primary px-3 py-2">Industry</span>
  <span class="badge bg-primary px-3 py-2">Government</span>
  <span class="badge bg-primary px-3 py-2">Society</span>
</div>
<p>Area yang perlu diprioritaskan:</p>
<ul>
  <li><strong>Digital literacy</strong> — meningkatkan kesadaran masyarakat tentang AI dan risikonya.</li>
  <li><strong>Media literacy</strong> — kemampuan membedakan informasi valid dari disinformasi AI-generated.</li>
  <li><strong>Ethical AI</strong> — mengembangkan dan menerapkan prinsip etika dalam desain AI.</li>
  <li><strong>Responsible deployment</strong> — memastikan AI di-deploy dengan pertimbangan risiko yang matang.</li>
  <li><strong>Regulation</strong> — mengembangkan kerangka regulasi yang tepat untuk AI.</li>
  <li><strong>Cybersecurity research</strong> — penelitian berkelanjutan dalam countermeasure AI.</li>
</ul>',
    2
),
(
    5,
    'Keterbatasan Penelitian dan Arah Masa Depan',
    '<h5>Limitations</h5>
<p>Systematic review ini memiliki keterbatasan yang perlu dipahami:</p>
<ul>
  <li><strong>Tidak tersedianya Web of Science</strong> — mengurangi cakupan literatur yang dapat diakses.</li>
  <li><strong>Timeframe terbatas</strong> — penelitian mencakup periode <strong>January 2022 hingga March 2023</strong>, sehingga dapat melewatkan artikel yang muncul setelah timeframe tersebut.</li>
  <li>Artikel non-peer-reviewed yang relevan mungkin terlewat karena exclusion criteria.</li>
</ul>
<p>Peneliti berusaha menjaga neutrality dan mengurangi bias melalui quality assessment yang sistematis.</p>
<h5 class="mt-4">Arah Penelitian Masa Depan</h5>
<p>Penelitian lebih lanjut masih dibutuhkan untuk memahami:</p>
<ul>
  <li>Bagaimana weaponization AI dapat dikontrol secara efektif.</li>
  <li>Bagaimana offensive AI dapat dilawan dengan defensive AI yang lebih baik.</li>
  <li>Implikasi hukum dan etika dari autonomous AI weapons.</li>
  <li>Strategi kolaborasi internasional dalam menghadapi AI-driven threats.</li>
</ul>
<div class="callout callout-info mt-3">
  <strong>Pesan Akhir:</strong> Penelitian mengenai weaponization AI masih berkembang. Komunitas akademik, industri, dan pemerintah perlu terus berkolaborasi untuk memastikan AI tetap menjadi kekuatan yang bermanfaat bagi kemanusiaan.
</div>',
    3
);
-- ─── VERIFY ──────────────────────────────────────────────────
SELECT 'Sections:' AS label, COUNT(*) AS count FROM sections
UNION ALL
SELECT 'Content Blocks:', COUNT(*) FROM content_blocks
UNION ALL
SELECT 'Users:', COUNT(*) FROM users;