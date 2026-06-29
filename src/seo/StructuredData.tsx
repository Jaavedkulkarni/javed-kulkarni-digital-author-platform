import { Helmet } from "react-helmet-async";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "जावेद कुलकर्णी",
    url: "https://javedkulkarni.com",
    image: "https://javedkulkarni.com/og-image.jpg",
    jobTitle: "Marathi Author",
    description:
      "मराठी लेखक, ब्लॉगर, कथाकार आणि Amazon Published Author",
    sameAs: [
      "https://www.amazon.in/",
      "https://www.facebook.com/",
      "https://www.instagram.com/",
      "https://www.linkedin.com/",
      "https://x.com/"
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