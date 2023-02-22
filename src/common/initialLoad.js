import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const InitialLoad = () => {
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

  global.ignoreCountry = [];
  global.defaultCountry = "US";
  global.ignoreStates = [];

  // const { enqueueSnackbar } = useSnackbar()
  // const classes = useStyles();
  // warning error info success
  return <></>;
};

export default InitialLoad;
