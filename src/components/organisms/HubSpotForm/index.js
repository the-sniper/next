import React, { useEffect } from "react";

const HubspotContactForm = (props) => {
  const { region, portalId, formId } = props;
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/v2.js";
    document.body.appendChild(script);

    script.addEventListener("load", () => {
      // @TS-ignore
      if (window.hbspt && typeof window !== "undefined") {
        // @TS-ignore
        window.hbspt.forms.create({
          region: "na1",
          portalId: "5241389",
          formId: "7216e6ad-cb72-4651-8d1e-a64d1877319b",
          target: "#hubspotForm",
        });
      }
    });
  }, []);

  return (
    <div>
      <div id="hubspotForm"></div>
    </div>
  );
};

export default HubspotContactForm;
