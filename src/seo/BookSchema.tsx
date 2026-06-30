import { Helmet } from "react-helmet-async";

interface BookSchemaProps {
  title: string;
  description: string;
  image: string;
  url: string;
  isbn: string;
  language: string;
  amazonUrl: string;
  author?: string;
}

export default function BookSchema({
  title,
  description,
  image,
  url,
  isbn,
  language,
  amazonUrl,
  author = "जावेद कुलकर्णी",
}: BookSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",

    name: title,
    description: description,
    url: url,
    image: `https://javedkulkarni.com${image}`,

    isbn: isbn,
    inLanguage: language,

    bookFormat: "https://schema.org/Paperback",

    author: {
      "@type": "Person",
      name: author,
      url: "https://javedkulkarni.com",
    },

    publisher: {
      "@type": "Person",
      name: author,
      url: "https://javedkulkarni.com",
    },

    sameAs: amazonUrl,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}