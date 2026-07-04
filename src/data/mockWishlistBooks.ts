import type { BookFormat } from '../components/book/bookTypes';
import type { WishlistAvailability } from '../components/wishlist/wishlistTypes';

export interface MockWishlistBook {
  id: string;
  title: string;
  author: string;
  cover: string | null;
  language: string;
  category: string;
  format: BookFormat;
  price: number;
  originalPrice: number | null;
  discount: number;
  membership: boolean;
  availability: WishlistAvailability;
  addedDate: string;
}

export const MOCK_WISHLIST_BOOKS: MockWishlistBook[] = [
  {
    id: 'wish-1',
    title: 'डिजिटल कैद',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/digital-kaid-mr.webp',
    language: 'मराठी',
    category: 'डिजिटल जीवन',
    format: 'ebook',
    price: 199,
    originalPrice: 299,
    discount: 33,
    membership: false,
    availability: 'in-stock',
    addedDate: '2026-03-15',
  },
  {
    id: 'wish-2',
    title: 'निर्णय घेण्याची कला',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/nirnay-ghenyachi-kala.webp',
    language: 'मराठी',
    category: 'आत्मविकास',
    format: 'ebook',
    price: 0,
    originalPrice: null,
    discount: 0,
    membership: true,
    availability: 'membership',
    addedDate: '2026-03-10',
  },
  {
    id: 'wish-3',
    title: 'Digital Detox',
    author: 'Javed Kulkarni',
    cover: '/covers/digital-detox-en.webp',
    language: 'English',
    category: 'Digital Life',
    format: 'ebook',
    price: 149,
    originalPrice: 249,
    discount: 40,
    membership: false,
    availability: 'in-stock',
    addedDate: '2026-02-28',
  },
  {
    id: 'wish-4',
    title: 'भूतसंस्कृती — भाग २',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/bhut-sanskriti-bhag-1.webp',
    language: 'मराठी',
    category: 'भयकथा',
    format: 'paperback',
    price: 350,
    originalPrice: 350,
    discount: 0,
    membership: false,
    availability: 'coming-soon',
    addedDate: '2026-02-14',
  },
  {
    id: 'wish-5',
    title: 'सहा आयाम 6D',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/saha-aayam-6d.webp',
    language: 'मराठी',
    category: 'आत्मविकास',
    format: 'audiobook',
    price: 299,
    originalPrice: 399,
    discount: 25,
    membership: true,
    availability: 'in-stock',
    addedDate: '2026-01-22',
  },
  {
    id: 'wish-6',
    title: 'वळण आणि वळावळ',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/valan-ani-valaval.webp',
    language: 'मराठी',
    category: 'नातेसंबंध',
    format: 'paperback',
    price: 275,
    originalPrice: null,
    discount: 0,
    membership: false,
    availability: 'out-of-stock',
    addedDate: '2026-01-08',
  },
  {
    id: 'wish-7',
    title: 'मेहंदी उतरल्यानंतरची गोष्ट',
    author: 'जावेद कुलकर्णी',
    cover: '/covers/mehandi-utarlyanantarchi-goshta.webp',
    language: 'मराठी',
    category: 'कथा',
    format: 'audiobook',
    price: 179,
    originalPrice: 229,
    discount: 22,
    membership: false,
    availability: 'in-stock',
    addedDate: '2025-12-20',
  },
];
