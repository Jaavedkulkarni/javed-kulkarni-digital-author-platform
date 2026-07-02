import { Link } from 'react-router-dom';
import { PublicSiteLayout } from '../components/layout/PublicSiteLayout';

const LEGAL_CONTENT: Record<string, { title: string; body: string }> = {
  privacy: {
    title: 'Privacy Policy',
    body: 'This website respects your privacy. Personal information collected through membership, newsletter signup, or contact forms is used only to provide services you request. We do not sell your data to third parties.',
  },
  terms: {
    title: 'Terms & Conditions',
    body: 'By using this website you agree to read content for personal use, respect copyright on books and articles, and use member features responsibly. Content remains the property of Javed Kulkarni unless otherwise stated.',
  },
  refund: {
    title: 'Refund Policy',
    body: 'Digital memberships and purchases follow the refund terms shown at checkout. Physical book purchases made on Amazon are subject to Amazon’s return and refund policies.',
  },
  shipping: {
    title: 'Shipping Policy',
    body: 'Printed books are fulfilled by Amazon or authorised retailers. Delivery times and shipping charges depend on the seller and your location at the time of purchase.',
  },
  cookies: {
    title: 'Cookie Policy',
    body: 'This site uses essential cookies and local storage for preferences such as theme selection and sign-in session state. You can clear these from your browser settings at any time.',
  },
};

interface LegalPageProps {
  page: keyof typeof LEGAL_CONTENT;
}

export function LegalPage({ page }: LegalPageProps) {
  const content = LEGAL_CONTENT[page];

  return (
    <PublicSiteLayout>
      <article className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-3xl font-bold text-white mb-4">{content.title}</h1>
        <p className="text-gray-300 leading-relaxed mb-8">{content.body}</p>
        <p className="text-gray-500 text-sm">
          Questions? <Link to="/#contact" className="text-gold-400 hover:text-gold-300">Contact us</Link>.
        </p>
      </article>
    </PublicSiteLayout>
  );
}

export default LegalPage;
