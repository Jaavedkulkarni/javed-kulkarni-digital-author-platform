import { Helmet } from "react-helmet-async";

interface BookSchemaProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

export default function BookSchema({
  title,
  description,
  image,
  url,
}: BookSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",

    name: title,

    author: {
      "@type": "Person",
      name: "जावेद कुलकर्णी",
      url: "https://javedkulkarni.com"
    },

    image: image,

    description: description,

    url: url,

    inLanguage: "mr",

    publisher: {
      "@type": "Person",
      name: "जावेद कुलकर्णी"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}