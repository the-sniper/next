import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import { useRouter } from "next/router";
import { Suspense } from "react";

function CommonTemplate({ children }) {
  const router = useRouter();
  return (
    <>
      <Suspense fallback="Loading suspense">
        <Header />
        <div>{children}</div>
        <Footer />
      </Suspense>
    </>
  );
}

export default CommonTemplate;
