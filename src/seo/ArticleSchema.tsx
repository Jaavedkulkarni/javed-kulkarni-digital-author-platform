import { Helmet } from "react-helmet-async";

interface ArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  author: string;
  publishedAt?: string;
  modifiedAt?: string;
}

export default function ArticleSchema({
  title,
  description,
  image,
  url,
  author,
  publishedAt,
  modifiedAt,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",

    headline: title,

    description,

    image: image
      ? image.startsWith("http")
        ? image
        : `https://javedkulkarni.com${image}`
      : "https://javedkulkarni.com/og-image.jpg",

    author: {
      "@type": "Person",
      name: author,
      url: "https://javedkulkarni.com",
    },

    publisher: {
      "@type": "Person",
      name: "जावेद कुलकर्णी",
      url: "https://javedkulkarni.com",
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },

    datePublished: publishedAt,

    dateModified: modifiedAt || publishedAt,

    url,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}