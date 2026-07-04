import type { BookFormat } from '../components/book/bookTypes';

export interface MockLibraryBook {
  id: string;
  title: string;
  author: string;
  cover: string | null;
  language: string;
  category: string;
  format: BookFormat;
  purchaseDate: string;
  progress: number;
  downloaded: boolean;
  completed: boolean;
  membership: boolean;
  lastOpened: string | null;
}

export const MOCK_LIBRARY_BOOKS: MockLibraryBook[] = [
  {
    id: 'lib-1',
    title: 'डिजिटल कैद',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/digital-kaid-mr.webp',
    language: 'मराठी',
    category: 'डिजिटल जीवन',
    format: 'ebook',
    purchaseDate: '2025-11-12',
    progress: 62,
    downloaded: true,
    completed: false,
    membership: false,
    lastOpened: '2026-03-28',
  },
  {
    id: 'lib-2',
    title: 'आधुनिक युगातील पालकत्व आणि मुलांमधलं अंतर',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/parenting.webp',
    language: 'मराठी',
    category: 'पालकत्व',
    format: 'paperback',
    purchaseDate: '2025-09-04',
    progress: 100,
    downloaded: true,
    completed: true,
    membership: false,
    lastOpened: '2026-02-14',
  },
  {
    id: 'lib-3',
    title: 'निर्णय घेण्याची कला',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/nirnay-ghenyachi-kala.webp',
    language: 'मराठी',
    category: 'आत्मविकास',
    format: 'ebook',
    purchaseDate: '2025-12-01',
    progress: 28,
    downloaded: false,
    completed: false,
    membership: true,
    lastOpened: '2026-03-30',
  },
  {
    id: 'lib-4',
    title: 'Digital Detox',
    author: 'Javed Kulkarni',
    cover: '/covers/digital-detox-en.webp',
    language: 'English',
    category: 'Digital Life',
    format: 'ebook',
    purchaseDate: '2026-01-18',
    progress: 0,
    downloaded: false,
    completed: false,
    membership: false,
    lastOpened: null,
  },
  {
    id: 'lib-5',
    title: 'भूतसंस्कृती — भाग १',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/bhut-sanskriti-bhag-1.webp',
    language: 'मराठी',
    category: 'भयकथा',
    format: 'paperback',
    purchaseDate: '2025-07-22',
    progress: 45,
    downloaded: true,
    completed: false,
    membership: false,
    lastOpened: '2026-03-10',
  },
  {
    id: 'lib-6',
    title: 'मेहंदी उतरल्यानंतरची गोष्ट',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/mehandi-utarlyanantarchi-goshta.webp',
    language: 'मराठी',
    category: 'कथा',
    format: 'audiobook',
    purchaseDate: '2025-10-08',
    progress: 100,
    downloaded: true,
    completed: true,
    membership: true,
    lastOpened: '2026-01-05',
  },
  {
    id: 'lib-7',
    title: 'सहा आयाम 6D',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/saha-aayam-6d.webp',
    language: 'मराठी',
    category: 'आत्मविकास',
    format: 'ebook',
    purchaseDate: '2026-02-20',
    progress: 12,
    downloaded: true,
    completed: false,
    membership: true,
    lastOpened: '2026-03-25',
  },
  {
    id: 'lib-8',
    title: 'वळण आणि वळावळ',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/valan-ani-valaval.webp',
    language: 'मराठी',
    category: 'नातेसंबंध',
    format: 'paperback',
    purchaseDate: '2025-05-15',
    progress: 75,
    downloaded: false,
    completed: false,
    membership: false,
    lastOpened: '2026-03-18',
  },
];
