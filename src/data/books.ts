export const AMAZON_AUTHOR_URL = 'https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C';
export const INSTAGRAM_AUTHOR_URL = 'https://instagram.com/authorjavedkulkarni';

export interface Book {
  id: number;
  slug: string;
  title: string;
  author: string;
  category: string;
  language: string;
  isbn: string;
  cover: string;
  description: string;
  whyRead: string;
  authorsNote: string;
  tableOfContents: string[];
  amazonUrl: string;
  relatedSlugs: string[];
}

export const books: Book[] = [
  {
    id: 1,
    slug: 'parenting',
    title: 'आधुनिक युगातील पालकत्व आणि मुलांमधलं अंतर',
    author: 'जावेद कुलकर्णी',
    category: 'पालकत्व',
    language: 'मराठी',
    isbn: '978-93-344-0195-0',
    cover: '/covers/parenting.webp',
    description:
      'आधुनिक काळातील पालक आणि मुलांमधील बदलते नाते, संवाद आणि समज यावर आधारित मार्गदर्शक पुस्तक. स्मार्टफोन, सोशल मीडिया आणि व्यस्त जीवनशैलीमुळे पालक आणि मुलांमधील भावनिक अंतर कसे वाढत आहे आणि ते कसे कमी करता येईल याचा व्यावहारिक आढावा.',
    whyRead:
      'जर तुम्हाला वाटत असेल की तुमचे मूल तुमच्यापासून दुरावत आहे किंवा संवाद कमी होत आहे, तर हे पुस्तक तुमच्यासाठी आहे. पालक म्हणून आपल्या मुलाशी जोडलेले राहणे, त्यांना समजून घेणे आणि आधुनिक काळातील आव्हाने सामोरे जाण्यासाठी हे पुस्तक मार्गदर्शक ठरेल.',
    authorsNote:
      'हे पुस्तक लिहिताना माझ्या मनात एकच विचार होता — प्रत्येक पालकाने आपल्या मुलाशी असलेल्या नात्याला पुन्हा एकदा जपावे. डिजिटल युगातील आव्हाने खरी आहेत, पण त्यावर मात करण्याची शक्ती प्रेम आणि संवादात आहे.',
    tableOfContents: [
      'प्रकरण १: आधुनिक पालकत्वाची नवी परिभाषा',
      'प्रकरण २: डिजिटल युगातील मुले',
      'प्रकरण ३: संवादाचे सेतू',
      'प्रकरण ४: भावनिक बुद्धिमत्ता आणि पालकत्व',
      'प्रकरण ५: सीमारेषा आणि स्वातंत्र्य',
      'प्रकरण ६: एकत्र वाढणे',
    ],
    amazonUrl: 'https://www.amazon.in/%E0%A4%86%E0%A4%A7%E0%A5%81%E0%A4%A8%E0%A4%BF%E0%A4%95-%E0%A4%AF%E0%A5%81%E0%A4%97%E0%A4%BE%E0%A4%A4%E0%A5%80%E0%A4%B2-%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A4%A4%E0%A5%8D%E0%A4%B5-%E0%A4%AE%E0%A5%81%E0%A4%B2%E0%A4%BE%E0%A4%82%E0%A4%AE%E0%A4%A7%E0%A4%B2%E0%A4%82-Marathi-ebook/dp/B0FNWGGYQX/',
    relatedSlugs: ['6d', 'nirnay'],
  },
  {
    id: 2,
    slug: 'bhut-sanskriti',
    title: 'भूत संस्कृती – भाग १',
    author: 'जावेद कुलकर्णी',
    category: 'भयकथा',
    language: 'मराठी',
    isbn: '978-93-344-1846-0',
    cover: '/covers/bhut-sanskriti-bhag-1.webp',
    description:
      'अदृश्य जग, भावना आणि रहस्यांनी भरलेली काल्पनिक भयकथा. भूत संस्कृती ही केवळ भयकथा नाही — ती एक सांस्कृतिक प्रवास आहे जो आपल्याला आपल्या लोककथा, दंतकथा आणि अदृश्य जगाशी जोडतो.',
    whyRead:
      'रोमांच, रहस्य आणि मराठी लोकसंस्कृतीच्या अदभुत विश्वात डुंबण्यासाठी हे पुस्तक वाचा. प्रत्येक कथा मनावर खोल ठसा उमटवते आणि रात्री झोप उडवण्याची ताकद ठेवते.',
    authorsNote:
      'भूत संस्कृती लिहिताना मी माझ्या बालपणातील आजी-आजोबांच्या गोष्टींमधून प्रेरणा घेतली. आपल्या मराठी संस्कृतीतील अदृश्य जगाच्या कल्पना आणि परंपरा जपण्याचा हा माझा प्रयत्न आहे.',
    tableOfContents: [
      'कथा १: काळी वाट',
      'कथा २: जुना वाडा',
      'कथा ३: आरशातील सावली',
      'कथा ४: रात्रीचा पाहुणा',
      'कथा ५: बंद दरवाजा',
      'कथा ६: अंधार आणि आवाज',
    ],
    amazonUrl: 'https://www.amazon.in/%E0%A4%AD%E0%A5%82%E0%A4%A4-%E0%A4%B8%E0%A4%82%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A5%83%E0%A4%A4%E0%A5%80-%E0%A4%AD%E0%A4%BE%E0%A4%97-%E0%A5%A7-Marathi-ebook/dp/B0FP5QN6YD/',
    relatedSlugs: ['mehandi', 'valan'],
  },
  {
    id: 3,
    slug: 'digital-detox-en',
    title: 'Digital Detox',
    author: 'Javed Kulkarni',
    category: 'Self Development',
    language: 'English',
    isbn: '978-93-344-2555-0',
    cover: '/covers/digital-detox-en.webp',
    description:
      'How to become the master of technology, not its prisoner. In a world where screens dominate every moment, this book offers a practical roadmap to reclaiming your time, focus, and mental health from the grip of digital addiction.',
    whyRead:
      'If you feel overwhelmed by notifications, social media, and the endless scroll, this book will help you take back control. Practical, actionable, and deeply researched — it\'s your guide to a healthier relationship with technology.',
    authorsNote:
      'I wrote this book because I lived through digital burnout myself. The strategies in this book are not theoretical — they are hard-earned lessons from my own journey to reclaim peace in a hyperconnected world.',
    tableOfContents: [
      'Chapter 1: The Digital Trap',
      'Chapter 2: Understanding Dopamine and Addiction',
      'Chapter 3: Mapping Your Digital Life',
      'Chapter 4: The 30-Day Detox Plan',
      'Chapter 5: Building Healthy Digital Habits',
      'Chapter 6: Living with Intention',
    ],
    amazonUrl: 'https://www.amazon.in/Digital-Detox-Become-Technology-Prisoner-ebook/dp/B0FT642GQ6/',
    relatedSlugs: ['digital-detox-mr', 'digital-prison-en', 'digital-kaid-mr'],
  },
  {
    id: 4,
    slug: 'digital-detox-mr',
    title: 'डिजिटल डिटॉक्स',
    author: 'जावेद कुलकर्णी',
    category: 'आत्मविकास',
    language: 'मराठी',
    isbn: '978-93-344-0462-3',
    cover: '/covers/digital-detox-mr.webp',
    description:
      'डिजिटल जगातून मानसिक स्वातंत्र्याकडे नेणारा व्यावहारिक प्रवास. तंत्रज्ञानाचा गुलाम न होता त्याचा मालक कसे व्हावे हे या पुस्तकात सांगितले आहे.',
    whyRead:
      'जर सोशल मीडिया, नोटिफिकेशन्स आणि स्क्रीन टाईम तुमच्या जीवनावर ताबा घेत असेल, तर हे पुस्तक तुम्हाला पुन्हा स्वतःचा ताबा मिळवण्यास मदत करेल. मराठीत उपलब्ध असलेले डिजिटल वेलनेसवरील सर्वात व्यावहारिक मार्गदर्शन.',
    authorsNote:
      'डिजिटल डिटॉक्स हे पुस्तक मी त्या क्षणी लिहायला सुरुवात केली जेव्हा मला जाणवले की माझा फोन माझ्यावर राज्य करतो आहे. हे बदलण्याचा माझा प्रवास म्हणजेच हे पुस्तक.',
    tableOfContents: [
      'प्रकरण १: डिजिटल जगाचे सत्य',
      'प्रकरण २: व्यसनाची मुळे',
      'प्रकरण ३: तुमचे डिजिटल जीवन मोजा',
      'प्रकरण ४: ३० दिवसांचा डिटॉक्स',
      'प्रकरण ५: निरोगी सवयी',
      'प्रकरण ६: जाणीवपूर्वक जगणे',
    ],
    amazonUrl: 'https://www.amazon.in/%E0%A4%A1%E0%A4%BF%E0%A4%9C%E0%A4%BF%E0%A4%9F%E0%A4%B2-%E0%A4%A1%E0%A4%BF%E0%A4%9F%E0%A5%89%E0%A4%95%E0%A5%8D%E0%A4%B8-%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A5%8D%E0%A4%B0%E0%A5%80%E0%A4%A8%E0%A4%AA%E0%A4%BE%E0%A4%B8%E0%A5%82%E0%A4%A8-%E0%A4%B8%E0%A4%82%E0%A4%A4%E0%A5%81%E0%A4%B2%E0%A4%A8%E0%A4%BE%E0%A4%9A%E0%A4%BE-Marathi-ebook/dp/B0FPG2VSPX/',
    relatedSlugs: ['digital-detox-en', 'digital-kaid-mr', 'digital-prison-en'],
  },
  {
    id: 5,
    slug: 'digital-kaid-mr',
    title: 'डिजिटल कैद आणि नव्या युगातील सायबर युद्ध',
    author: 'जावेद कुलकर्णी',
    category: 'डिजिटल जीवन',
    language: 'मराठी',
    isbn: '978-93-344-0590-3',
    cover: '/covers/digital-kaid-mr.webp',
    description:
      'डिजिटल व्यसन, माहिती युद्ध आणि सायबर सुरक्षेवरील पुस्तक. आपण नकळत डिजिटल कैदेत कसे अडकत आहोत आणि या कैदेतून बाहेर पडण्याचे मार्ग काय आहेत हे या पुस्तकात विस्ताराने सांगितले आहे.',
    whyRead:
      'सोशल मीडिया कंपन्या तुमचे लक्ष, वेळ आणि डेटा कसे चोरतात हे समजून घेण्यासाठी हे पुस्तक वाचा. डिजिटल जगात सुरक्षित राहण्यासाठी आणि माहिती युद्धापासून स्वतःचे रक्षण करण्यासाठी हे अत्यंत उपयुक्त आहे.',
    authorsNote:
      'हे पुस्तक लिहिताना मला जाणवले की आपण सर्वच एका अदृश्य कैदेत आहोत — आणि आपल्याला त्याची जाणीवही नाही. हे पुस्तक त्या जाणिवेची सुरुवात आहे.',
    tableOfContents: [
      'प्रकरण १: डिजिटल कैदेची ओळख',
      'प्रकरण २: सायबर युद्धाचे स्वरूप',
      'प्रकरण ३: माहिती युद्ध',
      'प्रकरण ४: आपला डेटा आणि गोपनीयता',
      'प्रकरण ५: सायबर सुरक्षा व्यावहारिक मार्गदर्शन',
      'प्रकरण ६: डिजिटल स्वातंत्र्याचा मार्ग',
    ],
    amazonUrl: 'https://www.amazon.in/%E0%A4%A1%E0%A4%BF%E0%A4%9C%E0%A4%BF%E0%A4%9F%E0%A4%B2-%E0%A4%95%E0%A5%88%E0%A4%A6-%E0%A4%A8%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%BE-%E0%A4%AF%E0%A5%81%E0%A4%97%E0%A4%BE%E0%A4%A4%E0%A5%80%E0%A4%B2-Marathi-ebook/dp/B0FNNFSQRV/',
    relatedSlugs: ['digital-prison-en', 'digital-detox-mr', 'digital-detox-en'],
  },
  {
    id: 6,
    slug: 'digital-prison-en',
    title: 'Digital Prison and the Cyber War of the New Age',
    author: 'Javed Kulkarni',
    category: 'Technology',
    language: 'English',
    isbn: '978-93-344-2678-6',
    cover: '/covers/digital-prison-en.webp',
    description:
      'Understand the hidden dangers of the digital era and cyber warfare. This book exposes how social media algorithms, big tech surveillance, and information warfare are silently controlling our lives, and what we can do to reclaim our freedom.',
    whyRead:
      'In an age where data is the new oil and your attention is the product, this book is essential reading. It will change how you see your phone, your social media feed, and the entire digital ecosystem you inhabit every day.',
    authorsNote:
      'I wrote this book because the digital prison is invisible — and that\'s what makes it so dangerous. Once you see it, you cannot unsee it. That awakening is the first step to freedom.',
    tableOfContents: [
      'Chapter 1: The Invisible Prison',
      'Chapter 2: How Big Tech Controls You',
      'Chapter 3: Information Warfare Explained',
      'Chapter 4: Your Data, Their Weapon',
      'Chapter 5: Practical Cybersecurity',
      'Chapter 6: Reclaiming Digital Freedom',
    ],
    amazonUrl: 'https://www.amazon.in/Digital-Prison-Cyber-Warfare-New-ebook/dp/B0FTMM37Z2/',
    relatedSlugs: ['digital-kaid-mr', 'digital-detox-en', 'digital-detox-mr'],
  },
  {
    id: 7,
    slug: 'mehandi',
    title: 'मेहंदी उतरल्यानंतरची गोष्ट',
    author: 'जावेद कुलकर्णी',
    category: 'कथा',
    language: 'मराठी',
    isbn: '978-93-5813-939-6',
    cover: '/covers/mehandi-utarlyanantarchi-goshta.webp',
    description:
      'भावना, नाती आणि आयुष्याच्या आठवणींवर आधारित कथासंग्रह. मेहंदी उतरल्यानंतर उरतं काय? या प्रश्नाचे उत्तर शोधत निघालेल्या या कथा आपल्याला नात्यांच्या खोल समुद्रात घेऊन जातात.',
    whyRead:
      'जर तुम्हाला नाती, भावना आणि आयुष्याच्या वळणांवरील साहित्य आवडत असेल, तर या कथासंग्रहातील प्रत्येक कथा तुमच्या हृदयाला स्पर्श करेल. यातील पात्रे तुम्हाला तुमच्या आयुष्याचाच भाग वाटतील.',
    authorsNote:
      'या कथा मी माझ्या आयुष्यात भेटलेल्या, ऐकलेल्या आणि जाणवलेल्या क्षणांमधून जन्माला आल्या. प्रत्येक कथेमागे एक खरी भावना आहे, एक खरे नाते आहे.',
    tableOfContents: [
      'कथा १: मेहंदी उतरल्यानंतरची गोष्ट',
      'कथा २: चहाचा रंग',
      'कथा ३: शेवटचे पत्र',
      'कथा ४: जुनी खिडकी',
      'कथा ५: आईचा हात',
      'कथा ६: परतीची वाट',
    ],
    amazonUrl: 'https://www.amazon.in/%E0%A4%AE%E0%A5%87%E0%A4%B9%E0%A5%87%E0%A4%82%E0%A4%A6%E0%A5%80-%E0%A4%89%E0%A4%A4%E0%A4%B0%E0%A4%B2%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%A8%E0%A4%82%E0%A4%A4%E0%A4%B0%E0%A4%9A%E0%A5%80-%E0%A4%97%E0%A5%8B%E0%A4%B7%E0%A5%8D%E0%A4%9F-%E0%A4%B2%E0%A4%97%E0%A5%8D%E0%A4%A8%E0%A4%BE%E0%A4%A8%E0%A4%82%E0%A4%A4%E0%A4%B0-%E0%A4%AC%E0%A4%A6%E0%A4%B2%E0%A4%A3%E0%A4%BE%E0%A4%B1%E0%A5%8D%E0%A4%AF%E0%A4%BE-ebook/dp/B0GY85KF6B/',
    relatedSlugs: ['valan', 'bhut-sanskriti'],
  },
  {
    id: 8,
    slug: 'nirnay',
    title: 'निर्णय घेण्याची कला',
    author: 'जावेद कुलकर्णी',
    category: 'आत्मविकास',
    language: 'मराठी',
    isbn: '978-93-344-1317-5',
    cover: '/covers/nirnay-ghenyachi-kala.webp',
    description:
      'भीती आणि संभ्रम दूर करून योग्य निर्णय घेण्याचे मार्गदर्शन. आयुष्यात येणाऱ्या प्रत्येक निर्णयाला सामोरे जाण्याची कला शिकवणारे हे पुस्तक आत्मविकासाच्या क्षेत्रातील एक महत्त्वाचे योगदान आहे.',
    whyRead:
      'प्रत्येकजण आयुष्यात निर्णय घेताना अडखळतो. भीती, संभ्रम आणि इतरांचे मत यांच्यात अडकलेल्या प्रत्येकासाठी हे पुस्तक एक प्रकाशदीप आहे. स्पष्टतेने आणि आत्मविश्वासाने निर्णय कसे घ्यावेत हे इथे सांगितले आहे.',
    authorsNote:
      'चांगले निर्णय घेणे ही एक कला आहे — आणि प्रत्येक कलेप्रमाणे ती शिकता येते. माझ्या स्वतःच्या अनुभवातून आणि संशोधनातून तयार झालेले हे पुस्तक तुम्हाला त्या कलेचे शिक्षण देईल.',
    tableOfContents: [
      'प्रकरण १: निर्णयाची भीती',
      'प्रकरण २: माहिती आणि अंतर्ज्ञान',
      'प्रकरण ३: पर्यायांचे मूल्यमापन',
      'प्रकरण ४: भावना आणि तर्क',
      'प्रकरण ५: चुकांमधून शिकणे',
      'प्रकरण ६: आत्मविश्वासाने पुढे जाणे',
    ],
    amazonUrl: 'https://www.amazon.in/%E0%A4%A8%E0%A4%BF%E0%A4%B0%E0%A5%8D%E0%A4%A3%E0%A4%AF-%E0%A4%98%E0%A5%87%E0%A4%A3%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%9A%E0%A5%80-%E0%A4%95%E0%A4%B2%E0%A4%BE-%E0%A4%98%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%B5%E0%A5%87%E0%A4%A4-Marathi-ebook/dp/B0H2NBTL47/',
    relatedSlugs: ['6d', 'parenting', 'digital-detox-mr'],
  },
  {
    id: 9,
    slug: '6d',
    title: 'जीवन बदलणारे सहा आयाम (6D)',
    author: 'जावेद कुलकर्णी',
    category: 'आत्मविकास',
    language: 'मराठी',
    isbn: '978-93-5933-125-6',
    cover: '/covers/saha-aayam-6d.webp',
    description:
      'विचार, नाती, ध्येय, भावना, आत्मशोध आणि विकास यांचा जीवनप्रवास. सहा आयामांमधून स्वतःला समजून घेणे आणि जीवन सुंदर बनवण्याचा हा एक सर्वांगीण मार्गदर्शक ग्रंथ आहे.',
    whyRead:
      'जर तुम्हाला आयुष्यात एक सर्वांगीण बदल हवा असेल — विचारात, नात्यात, ध्येयात आणि स्वतःशी — तर हे पुस्तक तुमचे साथीदार बनेल. 6D पद्धत तुम्हाला एका नव्या जीवनाकडे घेऊन जाईल.',
    authorsNote:
      '6D हे माझ्या सर्वात जवळचे पुस्तक आहे. या सहा आयामांवर काम करताना मी स्वतः बदललो — आणि हाच बदल मला तुमच्यापर्यंत पोहोचवायचा होता.',
    tableOfContents: [
      'आयाम १: विचार (Dimension of Thought)',
      'आयाम २: नाती (Dimension of Relationships)',
      'आयाम ३: ध्येय (Dimension of Purpose)',
      'आयाम ४: भावना (Dimension of Emotion)',
      'आयाम ५: आत्मशोध (Dimension of Self-Discovery)',
      'आयाम ६: विकास (Dimension of Growth)',
    ],
    amazonUrl: 'https://www.amazon.in/%E0%A4%9C%E0%A5%80%E0%A4%B5%E0%A4%A8-%E0%A4%AC%E0%A4%A6%E0%A4%B2%E0%A4%A3%E0%A4%BE%E0%A4%B0%E0%A5%87-%E0%A4%B8%E0%A4%B9%E0%A4%BE-%E0%A4%86%E0%A4%AF%E0%A4%BE%E0%A4%AE-%E0%A4%A4%E0%A5%81%E0%A4%AE%E0%A4%9A%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%A4%E0%A5%80%E0%A4%B2-ebook/dp/B0GX2NDFPB/',
    relatedSlugs: ['nirnay', 'digital-detox-mr', 'parenting'],
  },
  {
    id: 10,
    slug: 'valan',
    title: 'वळणं आणि वळवळ',
    author: 'जावेद कुलकर्णी',
    category: 'विनोदी लेखन',
    language: 'मराठी',
    isbn: '978-93-344-1174-4',
    cover: '/covers/valan-ani-valaval.webp',
    description:
      'हसत-हसत विचार करायला लावणारे हलकेफुलके लेख. वळणं आणि वळवळ म्हणजे आयुष्याच्या कठीण वळणांवर हसत-खेळत पुढे जाण्याची कला. या पुस्तकातील लेख वाचताना तुम्ही कधी हसाल, कधी विचार कराल आणि कधी स्वतःलाच ओळखाल.',
    whyRead:
      'आयुष्यात हास्याची, हलकेपणाची खूप गरज असते. वळणं आणि वळवळ वाचताना तुम्हाला हसू येईल — पण त्या हसण्यामागे एक गहन विचार लपलेला असेल. हे पुस्तक मन हलके करते आणि डोळे उघडते.',
    authorsNote:
      'विनोद हे माझे शस्त्र आहे — गंभीर गोष्टी हसत-हसत सांगण्याचे. या पुस्तकातील प्रत्येक लेखामागे एक निरीक्षण आहे, एक सत्य आहे, फक्त ते हसत सांगितले आहे.',
    tableOfContents: [
      'लेख १: वळणं आणि वळवळ',
      'लेख २: आधुनिक माणसाची गोष्ट',
      'लेख ३: सोशल मीडियाचा सामना',
      'लेख ४: ऑफिस जीवन',
      'लेख ५: नातेसंबंधातील गमती',
      'लेख ६: स्वतःशीच बोलणे',
    ],
    amazonUrl: 'https://www.amazon.in/%E0%A4%B5%E0%A4%B3%E0%A4%A3%E0%A4%82-%E0%A4%B5%E0%A4%B3%E0%A4%B5%E0%A4%B3-Marathi-Javed-Kulkarni-ebook/dp/B0FP54SS6H/',
    relatedSlugs: ['mehandi', 'bhut-sanskriti'],
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getRelatedBooks(slugs: string[]): Book[] {
  return slugs.map((s) => books.find((b) => b.slug === s)).filter(Boolean) as Book[];
}
