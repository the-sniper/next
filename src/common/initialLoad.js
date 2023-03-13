import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/auth/authContext";

const InitialLoad = () => {
  const authContext = useContext(AuthContext);

  const { loadUser } = authContext;

  const loaded = useRef(false);

  // Loading Google Place API Script
  function loadScript(src, position, id) {
    if (!position) {
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("id", id);
    script.src = src;
    position.appendChild(script);
  }

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  useEffect(() => {
    if (localStorage.token) {
      loadUser(localStorage.token);
    } else {
    }
  }, []);

  global.ignoreCountry = [];
  global.defaultCountry = "US";
  global.ignoreStates = [];

  return <> </>;
};

export default InitialLoad;
