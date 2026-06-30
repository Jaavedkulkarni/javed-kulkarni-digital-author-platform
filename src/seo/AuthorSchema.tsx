import { Helmet } from "react-helmet-async";

export default function AuthorSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",

    name: "जावेद कुलकर्णी",
    alternateName: "Javed Kulkarni",

    url: "https://javedkulkarni.com",

    image: "https://javedkulkarni.com/og-image.jpg",

    jobTitle: "Author",

    description:
      "Marathi Author, Blogger, Storyteller and Amazon Published Author.",

    nationality: "Indian",

    knowsLanguage: [
      "Marathi",
      "English",
      "Hindi"
    ],

    sameAs: [
      "https://www.amazon.in/stores/Javed-Kulkarni/author/B0FP584D9C",
      "https://www.facebook.com/authorjavedkulkarni",
      "https://www.instagram.com/authorjavedkulkarni"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}